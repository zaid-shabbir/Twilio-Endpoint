import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = 8000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/phone-numbers/check", async (req, res) => {
  try {
    const data = await client.availablePhoneNumbers("US").fetch();
    const list = data.subresource_uris.local;
    const response  = axios.get(`https://api.twilio.com${list}?AreaCode=${req.query.areaCode}`)
    res.status(200).send(response);
  } catch {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at port:${PORT}`);
});
