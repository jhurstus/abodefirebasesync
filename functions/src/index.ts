import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import * as admin from "firebase-admin";

// Writes incoming Abode webhook to realtime database.
export default onRequest(
  { timeoutSeconds: 1200, region: ["us-west1"] },
  (req, res) => {
    if (typeof req.query["newMode"] == "string") {
      const newMode = req.query["newMode"];

      let isArmed: boolean | undefined = undefined;
      if (newMode.includes("Standby")) {
        isArmed = false;
      } else if (newMode.includes("Home")) {
        isArmed = true;
      }

      if (typeof isArmed == "boolean") {
        if (admin.apps.length === 0) {
          initializeApp();
        }
        getDatabase().ref("home/isArmed").set(isArmed);
      }

    }

    if (req.query["doorName"] === "garage door") {
      let isOpen: boolean | undefined = undefined;
      if (req.query["opened"] === "1") {
        isOpen = true;
      } else if (req.query["closed"] === "true") {
        isOpen = false;
      }
      if (typeof isOpen == "boolean") {
        if (admin.apps.length === 0) {
          initializeApp();
        }
        getDatabase().ref("home/isGarageOpen").set(isOpen);
      }
    }
    res.status(200).send("Ack");
  });
