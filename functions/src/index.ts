import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

// Writes incoming Abode webhook to realtime database.
export default onRequest(
  { timeoutSeconds: 1200, region: ["us-west1"] },
  (req, res) => {
    if (typeof req.query["newMode"] == "string") {
      const newMode = req.query["newMode"];

      let isArmed: boolean | undefined = undefined;
      if (newMode == "Gateway Disarmed - Standby") {
        isArmed = false;
      } else if (newMode == "Gateway Armed - Home") {
        isArmed = true;
      }

      if (typeof isArmed == "boolean") {
        initializeApp();
        getDatabase().ref("home/isArmed").set(isArmed);
      }

    }
    // TODO: remove log after finished prod testing.
    logger.log(JSON.stringify(req.query), { q: req.query });
    res.status(200).send("Ack");
  });
