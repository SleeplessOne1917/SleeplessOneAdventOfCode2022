import { join } from 'path';
import { open } from 'fs/promises';

const addRegex = /addx (-?\d+)/;

async function* getLines() {
  const file = await open(join('10', 'input.txt'));

  for await (const line of file.readLines()) {
    yield line;
  }
}

const doCycles = async (
  handleCycle: (data: { currentCycle: number; xRegister: number }) => void
) => {
  let currentCycle = 1;
  let addNum: number | undefined = undefined;
  let xRegister = 1;
  const lines = getLines();
  let line = (await lines.next()).value;

  while (line) {
    handleCycle({ currentCycle, xRegister });

    if (line.includes('noop')) {
      ++currentCycle;

      line = (await lines.next()).value;
    } else if (addNum || addNum === 0) {
      xRegister += addNum;
      addNum = undefined;

      ++currentCycle;
      line = (await lines.next()).value;
    } else {
      const addMatch = line.match(addRegex)!;

      addNum = parseInt(addMatch[1], 10);
      ++currentCycle;
    }
  }
};

const sumSignalStrengths = async (cyclesToSum: number[]) => {
  let sum = 0;

  await doCycles(({ currentCycle, xRegister }) => {
    if (cyclesToSum.includes(currentCycle)) {
      sum += currentCycle * xRegister;
    }
  });

  return sum;
};

export const solution1 = async () => {
  console.log(
    'Finding sum of signal strength at 20th, 60th, 100th, 140th, 180th, and 220th cycles.'
  );

  console.log(
    `Sum is ${await sumSignalStrengths([20, 60, 100, 140, 180, 220])}`
  );
};

const drawScreen = async () => {
  let screen = '';

  await doCycles(({ currentCycle, xRegister }) => {
    const linePos = (currentCycle - 1) % 40;

    if (
      xRegister === linePos ||
      xRegister === linePos + 1 ||
      xRegister === linePos - 1
    ) {
      screen += '#';
    } else {
      screen += '.';
    }

    if (linePos === 39) {
      screen += '\n';
    }
  });

  console.log(screen);
};

export const solution2 = async () => {
  console.log('Displaying CRT\n');

  await drawScreen();
};
