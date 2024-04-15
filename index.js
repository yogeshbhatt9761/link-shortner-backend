const express = require("express");

const connectToMongoDB = require("./connect.js");
const urlRoute = require("./routes/url");
const URL = require("./models/url.js");

const app = express();
const PORT = 300;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => {
  console.log("MongoDB connected");
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  try {
    console.log("entered");
    const shortId = req.params.shortId;
    console.log(shortId);
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: { timeStamp: Date.now() },
        },
      }
    );
    res.redirect(entry.redirectURL);
  } catch (err) {
    console.log("err0r");
  }
});

app.listen(PORT, () => console.log(`server started at PORT - ${PORT}`));
