#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const yardsBuilderCallback = (yargs, type = "boolean", default = false) => {
  return yargs
    .option("year", {
      alias: "y",
      type,
      default,
    })
    .option("month", {
      alias: "m",
      type,
      default,
    })
    .option("date", {
      alias: "d",
      type,
      default,
    });
};

const setDatetime = (argv, operation) => {
  const multiplier = operation === "+" ? 1 : -1;
  const newDate = new Date();
  if (argv.year) {
    const currentYear = argv.datetime.getFullYear();
    newDate.setFullYear(currentYear + multiplier * argv.year);
  }
  if (argv.month) {
    const currentMonth = newDate.getMonth();
    newDate.setMonth(currentMonth + multiplier * argv.month);
  }
  if (argv.date) {
    const currentDay = newDate.getDate();
    newDate.setDate(currentDay + multiplier * argv.date);
  }

  return newDate;
};

const argv = yargs(hideBin(process.argv))
  .command(
    "current",
    false,
    (yargs) => yardsBuilderCallback(yargs),
    (argv) => {
      const currentDate = new Date();
      argv.datetime = currentDate;
      if (argv.year) {
        argv.datetime = currentDate.getFullYear();
        return;
      }
      if (argv.month) {
        argv.datetime = currentDate.getMonth() + 1;
        return;
      }
      if (argv.date) {
        argv.datetime = currentDate.getDate();
        return;
      }
    }
  )
  .command(
    "add",
    false,
    (yargs) => yardsBuilderCallback(yargs, "number", 0),
    (argv) => {
      argv.datetime = setDatetime(argv, "+");
    }
  )
  .command(
    "sub",
    false,
    (yargs) => yardsBuilderCallback(yargs, "number"),
    (argv) => {
      argv.datetime = argv.datetime = setDatetime(argv, "-");
    }
  ).argv;

console.log(argv.datetime);
