const axios = require("axios");
var fs = require("fs");

async function fetchJSON() {
  const fetchedData = await axios.get(
    "https://s3-eu-west-1.amazonaws.com/sentiance.solutions/datasets/public/user1.json"
  );
  fs.writeFile(
    "./public/fetchedData.json",
    JSON.stringify(fetchedData.data),
    error => {
      if (error) console.log("error while saving to file", error);
      console.log("saved to file");
    }
  );
}
fetchJSON();
