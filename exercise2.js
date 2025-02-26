const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const fs = require("fs")

const FILE_EXT_WITH_DOT = ".txt"

const argv = yargs(hideBin(process.argv)).option("file", {
  alias: "f",
  type: "string",
  default: "result",
}).help().argv

const filename = `${argv.file}${FILE_EXT_WITH_DOT}`

const parseGameDataToList = (data) => {
  return data.toString().split("\n").filter(item => item.length)
}


const getGameInfo = (dataList) => {
  console.log(dataList);
  
  const gamesCount = dataList.length;
  const gamesWinCount = dataList.filter(item => item.includes("Выйграл")).length
  const gamesLooseCount = dataList.filter(item => item.includes("Проиграл")).length

  const winPercent = Math.round(100 * gamesWinCount / gamesCount)

  return {
    gamesCount,
    gamesWinCount,
    gamesLooseCount,
    winLoosePercent: `${winPercent}/${100-winPercent}`
  }
}

fs.readFile(filename, (err, data) => {
  if (err) {
    console.warn(err)
    return
  }
  const dataList = parseGameDataToList(data)

  const gameInfo = getGameInfo(dataList)

  console.log("Количество партий: ", gameInfo.gamesCount);
  console.log("Количество выйгранных партий: ", gameInfo.gamesWinCount);
  console.log("Количество проигранных партий: ", gameInfo.gamesLooseCount);
  console.log("процент В/П: ", gameInfo.winLoosePercent);
})