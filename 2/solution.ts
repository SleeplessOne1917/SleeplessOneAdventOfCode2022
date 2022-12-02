import { join } from "path";
import { open } from "fs/promises";

const rock = "rock";
const scissors = "scissors";
const paper = "paper";

const lose = "lose";
const draw = "draw";
const win = "win";

type MoveType = "rock" | "paper" | "scissors";
type GameResult = "win" | "lose" | "draw";

const moveScoreMap = new Map<MoveType, number>([
  [rock, 1],
  [paper, 2],
  [scissors, 3],
]);

const resultScoreMap = new Map<GameResult, number>([
  [lose, 0],
  [draw, 3],
  [win, 6],
]);

const opponentMoveMap = new Map<string, MoveType>([
  ["A", rock],
  ["B", paper],
  ["C", scissors],
]);

const myMoveMap = new Map<string, MoveType>([
  ["X", rock],
  ["Y", paper],
  ["Z", scissors],
]);

const playGame = (opponentMove: MoveType, myMove: MoveType): GameResult => {
  const moves = new Set([opponentMove, myMove]);

  if (opponentMove === myMove) {
    return draw;
  } else if (moves.has(rock) && moves.has(paper)) {
    return myMove === paper ? win : lose;
  } else if (moves.has(rock) && moves.has(scissors)) {
    return myMove === rock ? win : lose;
  } else {
    return myMove === scissors ? win : lose;
  }
};

const gameRegex = /\s*([A-C])\s+([X-Z])\s*/;

const calculateScore = (move: MoveType, result: GameResult) =>
  (moveScoreMap.get(move) ?? 0) + (resultScoreMap.get(result) ?? 0);

export const solution1 = async () => {
  console.log("Calculating score of rock paper scissors games.");
  const file = await open(join("2", "input.txt"));

  let score = 0;

  for await (const line of file.readLines()) {
    const matchRegexMatch = line.match(gameRegex)!;

    const opponentMove = opponentMoveMap.get(matchRegexMatch[1])!;
    const myMove = myMoveMap.get(matchRegexMatch[2])!;

    const result = playGame(opponentMove, myMove);

    score += calculateScore(myMove, result);
  }

  console.log(`Your score for the rock paper scissors tournament is: ${score}`);
};

const gameResultMap = new Map<string, GameResult>([
  ["X", lose],
  ["Y", draw],
  ["Z", win],
]);

const calculateMove = (opponentMove: MoveType, gameResult: GameResult) => {
  if (gameResult === draw) {
    return opponentMove;
  } else if (opponentMove === rock) {
    return gameResult === win ? paper : scissors;
  } else if (opponentMove === paper) {
    return gameResult === win ? scissors : rock;
  } else {
    return gameResult === win ? rock : paper;
  }
};

export const solution2 = async () => {
  console.log("Calculating score of rock paper scissors games.");
  const file = await open(join("2", "input.txt"));

  let score = 0;

  for await (const line of file.readLines()) {
    const matchRegexMatch = line.match(gameRegex)!;

    const opponentMove = opponentMoveMap.get(matchRegexMatch[1])!;
    const result = gameResultMap.get(matchRegexMatch[2])!;

    const myMove = calculateMove(opponentMove, result);

    score += calculateScore(myMove, result);
  }

  console.log(`Your score for the rock paper scissors tournament is: ${score}`);
};
