var fs = require("fs");
const axios = require("axios");
const models = require("../models");

async function saveJSONToDB() {
  let readData = await readJsonFile();
  await fillSegmentTable(JSON.parse(JSON.stringify(readData.data.user)));
  await fillEventHistoryTable(JSON.parse(JSON.stringify(readData.data.user)));
  await fillMomentHistoryTable(readData.data.user.moment_history);
}

// const fillAggregates = () =>
//   new Promise(async (resolve) => {
//     try {
//       const rec = await models.EventHistory.findAll({
//         group: ['mode'],
//       });
//       console.log(rec, '......rec.....');

//       resolve(true);
//     } catch (error) {
//       console.log(error, '!!!!!!fillAggregates!!!!!');
//       resolve(false);
//     }
//   });

const fillMomentHistoryTable = momentHistory =>
  new Promise(async (resolve, reject) => {
    try {
      const promisesArr = await Promise.all(
        momentHistory.map(
          async ({ moment_definition_id, analysis_type, end, start }) => {
            const duration =
              new Date(end).getTime() / 1000 - new Date(start).getTime() / 1000;
            const record = await models.MomentHistory.create({
              moment_definition_id,
              analysis_type,
              end,
              start,
              duration
            });

            return true;
          }
        )
      );
      resolve(true);
    } catch (error) {
      console.log(error, "!!!!!!!!!!!!!");
      resolve(false);
    }
  });

function fillSegmentTable(userData) {
  return new Promise(async (resolve, reject) => {
    if (
      userData &&
      userData.hasOwnProperty("segments") &&
      userData.segments.length
    ) {
      Promise.all(
        userData.segments.map(async singleSegmentData => {
          if (
            singleSegmentData &&
            singleSegmentData.hasOwnProperty("segment_definition")
          ) {
            let newSegmentRecord = {
              idTag: "",
              display_name: "",
              description: ""
            };
            Object.keys(singleSegmentData.segment_definition).map(key => {
              if (key === "id")
                newSegmentRecord["idTag"] =
                  singleSegmentData.segment_definition[key];
              else
                newSegmentRecord[key] =
                  singleSegmentData.segment_definition[key];
            });
            try {
              const createdNewSegmentRecord = await models.Segment.create(
                JSON.parse(JSON.stringify(newSegmentRecord))
              );
            } catch (error) {
              console.log(
                "Error while adding segment record",
                error,
                newSegmentRecord
              );
            }
          }
        })
      )
        .then(res => {
          console.log("Done adding into segment table");
          return resolve(res);
        })
        .catch(err => {
          console.log("Error while adding into segment table");
          return resolve(err);
        });
    }
  });
}

function fillEventHistoryTable(userData) {
  return new Promise((resolve, reject) => {
    if (
      userData &&
      userData.hasOwnProperty("event_history") &&
      userData.event_history.length
    ) {
      Promise.all(
        userData.event_history.map(async singleEventData => {
          if (singleEventData && singleEventData.type === "Transport") {
            console.log("singleEventData", singleEventData);
            let newEventRecord = {
              type: "",
              start: 0,
              end: 0,
              analysis_type: "",
              mode: "",
              distance: "",
              trajectory: {},
              duration: 0
            };
            Object.keys(singleEventData).map(key => {
              if (key !== "waypoints") {
                if (key === "start" || key === "end")
                  newEventRecord[key] = new Date(
                    singleEventData[key]
                  ).getTime();
                else newEventRecord[key] = singleEventData[key];
              }
            });
            newEventRecord["duration"] =
              newEventRecord["end"] / 1000 - newEventRecord["start"] / 1000;
            try {
              const createdNewEventRecord = await models.EventHistory.create(
                JSON.parse(JSON.stringify(newEventRecord))
              );
              console.log("Added event data", createdNewEventRecord);
            } catch (error) {
              console.log(
                "Error while adding event record",
                error,
                newEventRecord
              );
            }
          }
        })
      )
        .then(res => {
          console.log("Done adding into event history table");
          return resolve(res);
        })
        .catch(err => {
          console.log("Error while adding into event history table", err);
          return resolve(err);
        });
    }
  });
}

function readJsonFile() {
  return new Promise((resolve, reject) => {
    fs.readFile("./public/fetchedData.json", (err, data) => {
      if (err) {
        console.log("Error===>", err);
        return resolve(err);
      }
      return resolve(JSON.parse(data));
    });
  });
}

async function fetchAndSave() {
  console.log(
    "Started fetching data-------------------------------------------------------------- : "
  );
  try {
    await saveJSONToDB();
  } catch (e) {
    console.error(
      e,
      "!!!!!!!!!!!!!!!!!!!error in saving saveJsonToDB.js!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
  }

  console.log(
    "Finished saving to db >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
  );

  process.exit(0);
}

fetchAndSave();

process.on("unhandledRejection", err => {
  console.log("Unhandled rejection", err);
});

process.on("uncaughtException", err => {
  console.log("Uncaught exception", err);
});
