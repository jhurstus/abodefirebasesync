import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
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
    // TODO: remove log after finished prod testing.
    logger.log(JSON.stringify(req.query), { q: req.query });
    res.status(200).send("Ack");
  });
