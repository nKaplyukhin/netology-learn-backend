
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const fs = require("fs")
const rl = readline.createInterface({ input, output, });

const FILE_EXT_WITH_DOT = ".txt"

const argv = yargs(hideBin(process.argv)).option("result", {
  alias: "R",
  type: "string",
  default: "result",
}).help().argv

const filename = `${argv.result}${FILE_EXT_WITH_DOT}`

const getLastStepCounter = () => {
  const data = fs.readFileSync(filename)
  return data.toString().split("\n").filter(item => item.length).length || 0
}

let stepCounter = getLastStepCounter();

const askQuestion = () => {
  const randomData = Math.floor(Math.random() * 2) + 1;
  let isWin = false

  rl.question("Выбери Орел(1) или решка(2): ", (answer) => {
    const answerNumber = +answer;
    stepCounter += 1;

    if (answerNumber === randomData) {
      console.log(`Верно`);
      isWin = true
    } else {
      isWin = false
      console.log(`Неверно`);
    }
    const gameInfo = `${stepCounter}: ${isWin ? "Выйграл" : "Проиграл"}\n`

    fs.appendFile(filename, gameInfo, (err) => {
      if (err) {
        console.warn(err);
      }
    })

    rl.question("Сыграть еще\n1-да\n2-нет\n", (answer2) => {
      const answerNumber = +answer2;
      if (answerNumber === 1) {
        askQuestion();
        return
      }
      rl.close();
      return
    })
  });
};

askQuestion();