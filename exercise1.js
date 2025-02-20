#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const yardsBuilderCallback = (yargs, type = "boolean") => {
  return yargs
    .option("year", {
      alias: "y",
      type,
      default: false,
    })
    .option("month", {
      alias: "m",
      type,
      default: false,
    })
    .option("date", {
      alias: "d",
      type,
      default: false,
    });
};

const argv = yargs(hideBin(process.argv))
  .command(
    "current",
    false,
    (yargs) => yardsBuilderCallback(yargs, "boolean"),
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
    (yargs) => yardsBuilderCallback(yargs, "number"),
    (argv) => {
      argv.datetime = new Date();
      if (argv.year) {
        const currentYear = argv.datetime.getFullYear();
        argv.datetime.setFullYear(currentYear + argv.year);
      }
      if (argv.month) {
        const currentMonth = argv.datetime.getMonth();
        argv.datetime.setMonth(currentMonth + argv.month);
      }
      if (argv.date) {
        const currentDay = argv.datetime.getDate();
        argv.datetime.setDate(currentDay + argv.date);
      }
    }
  )
  .command(
    "sub",
    false,
    (yargs) => yardsBuilderCallback(yargs, "number"),
    (argv) => {
      argv.datetime = new Date();
      if (argv.date) {
        const currentDay = argv.datetime.getDate();
        argv.datetime.setDate(currentDay - argv.date);
      }
      if (argv.month) {
        const currentMonth = argv.datetime.getMonth();
        argv.datetime.setMonth(currentMonth - argv.month);
      }
      if (argv.year) {
        const currentYear = argv.datetime.getFullYear();
        argv.datetime.setFullYear(currentYear - argv.year);
      }
    }
  ).argv;

console.log(argv.datetime);
