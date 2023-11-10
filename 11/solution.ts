import { join } from 'path';
import { open } from 'fs/promises';

let monkies: Monkey[] = [];

type MonkeyArgs = {
  items: number[];
  operation: (old: number) => number;
  testNum: number;
  testTrueMonkey: number;
  testFalseMonkey: number;
};

class Monkey {
  items: number[];
  operation: (old: number) => number;
  throw: (item: number) => void;
  testNum: number;

  constructor({
    items,
    operation,
    testNum,
    testTrueMonkey,
    testFalseMonkey,
  }: MonkeyArgs) {
    this.items = items;
    this.operation = operation;
    this.testNum = testNum;
    this.throw = (item: number) => {
      if (item % testNum === 0) {
        monkies[testTrueMonkey].items.push(item);
      } else {
        monkies[testFalseMonkey].items.push(item);
      }
    };
  }
}

const itemsRegex = /Starting items: ((?:\d+(?:, )?)+)/;
const operationRegex = /Operation: new = old (\*|\+) (\d+|old)/;
const testRegex = /Test: divisible by (\d+)/;
const testTrueRegex = /If true: throw to monkey (\d+)/;
const testFalseRegex = /If false: throw to monkey (\d+)/;

const initializeMonkies = async () => {
  monkies = [];
  const file = await open(join('11', 'input.txt'));

  let args: Partial<MonkeyArgs> = {};
  for await (const line of file.readLines()) {
    if (itemsRegex.test(line)) {
      const itemsMatch = line.match(itemsRegex)!;
      const items = itemsMatch[1].split(', ').map((item) => parseInt(item, 10));
      args.items = items;
    }

    if (operationRegex.test(line)) {
      const operationMatch = line.match(operationRegex)!;
      const num = parseInt(operationMatch[2], 10);

      args.operation = (old) =>
        operationMatch[1] === '+'
          ? old + (isNaN(num) ? old : num)
          : old * (isNaN(num) ? old : num);
    }

    if (testRegex.test(line)) {
      const testMatch = line.match(testRegex)!;

      args.testNum = parseInt(testMatch[1], 10);
    }

    if (testTrueRegex.test(line)) {
      const testTrueMatch = line.match(testTrueRegex)!;

      args.testTrueMonkey = parseInt(testTrueMatch[1], 10);
    }

    if (testFalseRegex.test(line)) {
      const testFalseMatch = line.match(testFalseRegex)!;

      args.testFalseMonkey = parseInt(testFalseMatch[1], 10);

      const monkey = new Monkey(args as MonkeyArgs);
      monkies.push(monkey);

      args = {};
    }
  }
};

const calculateMonkeyBusiness = async ({
  rounds,
  shouldDivideWorryLevel,
}: {
  rounds: number;
  shouldDivideWorryLevel: boolean;
}) => {
  await initializeMonkies();

  const inspections = [...Array(monkies.length).keys()].map(() => 0);
  const limit = monkies.reduce((acc, { testNum }) => acc * testNum, 1);

  for (let round = 0; round < rounds; ++round) {
    //console.log(`Doing round ${round + 1}`);
    monkies.forEach((monkey, i) => {
      monkey.items.forEach((item, j) => {
        ++inspections[i];
        let itemToThrow = item;
        itemToThrow = monkey.operation(itemToThrow % limit);

        if (shouldDivideWorryLevel) {
          itemToThrow = itemToThrow / 3;
        }

        monkey.throw(itemToThrow);
      });

      monkey.items = [];
    });
  }

  return [...inspections]
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((acc, cur) => cur * acc, 1);
};

const solution = async ({
  rounds,
  shouldDivideWorryLevel,
}: {
  rounds: number;
  shouldDivideWorryLevel: boolean;
}) => {
  console.log('Calculating monkey business');

  console.log(
    `Monkey business level after ${rounds} rounds is ${await calculateMonkeyBusiness(
      {
        rounds,
        shouldDivideWorryLevel,
      },
    )}`,
  );
};

export const solution1 = async () =>
  await solution({ rounds: 20, shouldDivideWorryLevel: true });

export const solution2 = async () =>
  await solution({ rounds: 10000, shouldDivideWorryLevel: false });
