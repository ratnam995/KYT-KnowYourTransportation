const sequelize = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();
const data = require("./public/fetchedData");
const models = require("./src/models");
console.log(data, ".....data.......", sequelize);

const port = 3030;

const fillAggregates = (startDate, endDate) =>
  new Promise(async resolve => {
    try {
      let query;
      if (startDate && endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        query =
          `SELECT MODE, COUNT(MODE) AS frequency, SUM(DISTANCE) AS distance, SUM(DURATION) AS duration FROM "EventHistories" WHERE START BETWEEN ` +
          start +
          ` AND ` +
          end +
          ` GROUP BY MODE`;
      } else {
        query = `SELECT MODE, COUNT(MODE) AS frequency, SUM(DISTANCE) AS distance, SUM(DURATION) AS duration FROM "EventHistories" GROUP BY MODE`;
      }

      const rec = await models.sequelize.query(query, {
        type: models.sequelize.QueryTypes.SELECT
      });

      resolve(rec);
    } catch (error) {
      console.log(error, "!!!!!!fillAggregates fails!!!!!");
      resolve(error);
    }
  });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));


app.post("/api/getDataSet", async (req, res) => {
  try {
    console.log("startDate", req);
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let fetchedData = await fillAggregates(startDate, endDate);
    res.send(fetchedData);
  } catch (error) {
    console.log(error, "!!!!!!FetchDataFails!!!!!!");
    res.send("Error while fetching data");
  }
});

app.listen(port, () => {
  console.log("We are live on " + port);
});
