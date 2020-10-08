const express = require("express"),
  app = express(),
  path = require("path"),
  fs = require("fs"),
  parser = require("body-parser"),
  axios = require("axios"),
  https = require("https");
  http = require("http");
var jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
var cors = require("cors");
var FormData = require("form-data");
app.use(cors());
app.use(parser.json());
app.use(
  parser.urlencoded({
    extended: true
  })
);

const options = {
  cert: fs
    .readFileSync("/etc/letsencrypt/live/bill.pogo91.com/fullchain.pem")
    .toString(),
  key: fs
    .readFileSync("/etc/letsencrypt/live/bill.pogo91.com/privkey.pem")
    .toString()
};
// app.listen(5000, () => console.log("1223434"));
app.get("/", (req, res) => {
  console.log("listing on port");
  res.send("Testing");
});
app.post("", async (req, res) => {
  var decoded_data = jwt.decode(Object.keys(req.body)[0]);
  if (decoded_data.type === "get") {
    const response = await axios.get(decoded_data.url, decoded_data.headers);
    res.json(response.data);
  } else if (decoded_data.type === "post") {
    const formData = new FormData();
    Object.entries(decoded_data.params).forEach(entry => {
      formData.append(entry[0], entry[1]);
    });
    try {
      const config = {
        method: "POST",
        body: formData
      };

      fetch(
        decoded_data.url,
        config
      )
        .then(response => response.json())
        .then(response => res.send(response));
    } catch (error) {
      console.log("err", error);
    }
  } else if (decoded_data.type === "put") {
    const response = await axios.put(
      decoded_data.url,
      decoded_data.params,
      decoded_data.headers
    );
    res.json(response.data);
  }
});

var server = https.createServer(options, app).listen(5000, () => {
  console.log(
    `Open browser on https://bill.pogo91.com:${server.address().port}`
  );
});
// var server = http.createServer(app).listen(5000, () => {
//   console.log(
//     `Open browser on http://3.6.240.144:${server.address().port}`
//   );
// });
