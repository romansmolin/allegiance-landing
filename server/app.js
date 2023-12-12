const express = require("express");
const path = require("path");
const app = express();

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = require("twilio")(accountSid, authToken);

app.use(express.static(path.resolve(__dirname, "../client")));
app.use(express.json());

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "index.html"));
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

// SEND OTP CODE ENDPOINT

app.post("/send-verification", (req, res) => {
  const phoneNumber = req.body.phone;
  client.verify
    .services(verifySid)
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification) => {
      res.json({ success: true, sid: verification.sid });
    })
    .catch((error) => {
      res.status(500).json({ success: false, error: error.message });
    });
});

// VERIFY OTP CODE ENDPOINT

app.post("/confirm-otp-code", (req, res) => {
  const otpCode = req.body.code;
  const phoneNumber = req.body.phone;

  client.verify
    .services(verifySid)
    .verificationChecks.create({ to: phoneNumber, code: otpCode })
    .then((verification_status) => {
      // Send the verification status back to the client
      res.json({ valid: verification_status.valid });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});