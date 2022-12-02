import {
  solution1 as day1Solution1,
  solution2 as day1Solution2,
} from "./1/solution";
import {
  solution1 as day2Solution1,
  solution2 as day2Solution2,
} from "./2/solution";

import { createInterface } from "readline/promises";

const solutions = new Map<number, Map<number, () => Promise<void>>>([
  [
    1,
    new Map([
      [1, day1Solution1],
      [2, day1Solution2],
    ]),
  ],
  [
    2,
    new Map([
      [1, day2Solution1],
      [2, day2Solution2],
    ]),
  ],
]);

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const run = async () => {
  let keepRunning = true;
  do {
    let day = await readline.question("Please select which challenge day  ");

    let dayNum = parseInt(day, 10);

    while (isNaN(dayNum) || !solutions.has(dayNum)) {
      day = await readline.question("Invalid day. Please try again  ");
      dayNum = parseInt(day, 10);
    }

    let challenge = await readline.question(
      "Would you like to do challenge 1 or 2?  "
    );

    let challengeNum = parseInt(challenge, 10);

    while (isNaN(challengeNum) || !solutions.get(dayNum)?.has(challengeNum)) {
      challenge = await readline.question(
        "Invalid challenge. Please try again.  "
      );

      challengeNum = parseInt(challenge, 10);
    }

    const solutionToRun = solutions.get(dayNum)?.get(challengeNum)!;
    await solutionToRun();

    let shouldContinue = await readline.question(
      "Do you want to run another challenge?  "
    );
    while (
      !(/^[yY].*/.test(shouldContinue) || /^[nN].*/.test(shouldContinue))
    ) {
      shouldContinue = await readline.question(
        'Input must be "yes" or "no". Please try again  '
      );
    }

    keepRunning = /^[yY].*/.test(shouldContinue);
    console.log(keepRunning);
  } while (keepRunning);

  process.exit(0);
};

run();
