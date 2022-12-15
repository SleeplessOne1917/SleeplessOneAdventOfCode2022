import {
  solution1 as day10Solution1,
  solution2 as day10Solution2,
} from './10/solution';
import {
  solution1 as day11Solution1,
  solution2 as day11Solution2,
} from './11/solution';
import {
  solution1 as day1Solution1,
  solution2 as day1Solution2,
} from './1/solution';
import {
  solution1 as day2Solution1,
  solution2 as day2Solution2,
} from './2/solution';
import {
  solution1 as day3Solution1,
  solution2 as day3Solution2,
} from './3/solution';
import {
  solution1 as day4Solution1,
  solution2 as day4Solution2,
} from './4/solution';
import {
  solution1 as day5Solution1,
  solution2 as day5Solution2,
} from './5/solution';
import {
  solution1 as day6Solution1,
  solution2 as day6Solution2,
} from './6/solution';
import {
  solution1 as day7Solution1,
  solution2 as day7Solution2,
} from './7/solution';
import {
  solution1 as day8Solution1,
  solution2 as day8Solution2,
} from './8/solution';
import {
  solution1 as day9Solution1,
  solution2 as day9Solution2,
} from './9/solution';

import { createInterface } from 'readline/promises';

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
  [
    3,
    new Map([
      [1, day3Solution1],
      [2, day3Solution2],
    ]),
  ],
  [
    4,
    new Map([
      [1, day4Solution1],
      [2, day4Solution2],
    ]),
  ],
  [
    5,
    new Map([
      [1, day5Solution1],
      [2, day5Solution2],
    ]),
  ],
  [
    6,
    new Map([
      [1, day6Solution1],
      [2, day6Solution2],
    ]),
  ],
  [
    7,
    new Map([
      [1, day7Solution1],
      [2, day7Solution2],
    ]),
  ],
  [
    8,
    new Map([
      [1, day8Solution1],
      [2, day8Solution2],
    ]),
  ],
  [
    9,
    new Map([
      [1, day9Solution1],
      [2, day9Solution2],
    ]),
  ],
  [
    10,
    new Map([
      [1, day10Solution1],
      [2, day10Solution2],
    ]),
  ],
  [
    11,
    new Map([
      [1, day11Solution1],
      [2, day11Solution2],
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
    let day = await readline.question('Please select which challenge day  ');

    let dayNum = parseInt(day, 10);

    while (isNaN(dayNum) || !solutions.has(dayNum)) {
      day = await readline.question('Invalid day. Please try again  ');
      dayNum = parseInt(day, 10);
    }

    let challenge = await readline.question(
      'Would you like to do challenge 1 or 2?  '
    );

    let challengeNum = parseInt(challenge, 10);

    while (isNaN(challengeNum) || !solutions.get(dayNum)?.has(challengeNum)) {
      challenge = await readline.question(
        'Invalid challenge. Please try again.  '
      );

      challengeNum = parseInt(challenge, 10);
    }

    const solutionToRun = solutions.get(dayNum)?.get(challengeNum)!;
    await solutionToRun();

    let shouldContinue = await readline.question(
      'Do you want to run another challenge?  '
    );
    while (
      !(/^[yY].*/.test(shouldContinue) || /^[nN].*/.test(shouldContinue))
    ) {
      shouldContinue = await readline.question(
        'Input must be "yes" or "no". Please try again  '
      );
    }

    keepRunning = /^[yY].*/.test(shouldContinue);
  } while (keepRunning);

  process.exit(0);
};

run();
