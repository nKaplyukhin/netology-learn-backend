#!/usr/bin/env node
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const rl = readline.createInterface({ input, output });

const hiddenNumber = Math.floor(Math.random() * 101);
let stepCounter = 0;

const askQuestion = (value) => {
  rl.question("Загадано число в диапазоне от 0 до 100 ", (answer) => {
    const answerNumber = +answer;
    stepCounter += 1;

    if (answerNumber === hiddenNumber) {
      console.log(`Отгадано число ${hiddenNumber} за ${stepCounter} ходов`);
      rl.close();
      return;
    } else {
      if (hiddenNumber < answerNumber) {
        console.log("Меньше");
      } else {
        console.log("Больше");
      }
      askQuestion(value);
    }
  });
};

askQuestion(null);
