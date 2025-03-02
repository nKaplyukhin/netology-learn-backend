const http = require("http");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const apiKey = process.env.API_KEY;

const argv = yargs(hideBin(process.argv))
  .option("city", {
    alias: "C",
    type: "string",
    default: "krasnoyarsk",
  })
  .help().argv;

const query = argv.city || process.env.DEFAULT_QUERY;

const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${query}`;

http
  .get(url, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      console.log(statusCode);
      return;
    }

    res.setEncoding("utf-8");

    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      const parsedData = JSON.parse(data);
      const temperature = parsedData.current.temperature;
      const city = parsedData.location.name || query;
      console.log(`Temperature in ${city}: ${temperature}°C`);
    });
  })
  .on("error", (error) => {
    console.error(error);
  });
