import { open } from 'fs/promises';
import path from 'path';

export const solution1 = async () => {
  console.log('Finding largest number of calories carried by a single elf.');
  const input = await open(path.join('1', 'input.txt'));

  let highest = 0;
  let current = 0;

  for await (const line of input.readLines()) {
    const lineNum = parseInt(line, 10);

    if (isNaN(lineNum)) {
      highest = current > highest ? current : highest;
      current = 0;
    } else {
      current += lineNum;
    }
  }

  console.log(`Largest number of calories: ${highest}`);
};

export const solution2 = async () => {
  console.log(
    'Finding sum of calories carries by the 3 highest calorie carraying elves'
  );
  const input = await open(path.join('1', 'input.txt'));

  const calorieTotals = [];
  let current = 0;

  for await (const line of input.readLines()) {
    const lineNum = parseInt(line, 10);

    if (isNaN(lineNum)) {
      calorieTotals.push(current);
      current = 0;
    } else {
      current += lineNum;
    }
  }

  const total = [...calorieTotals]
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((acc, cur) => acc + cur, 0);

  console.log(`Sum of 3 highest calorie holder's calories: ${total}`);
};
