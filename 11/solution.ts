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

type SolutionArgs = {
  rounds: number;
  shouldDivide?: boolean;
};

class Monkey {
  items: number[];
  operation: (old: number) => number;
  throw: (item: number) => void;
  testNum: number;
  inspections = 0;

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
      monkies[
        item % testNum === 0 ? testTrueMonkey : testFalseMonkey
      ].items.push(item);
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
      args.items = itemsMatch[1].split(', ').map((item) => parseInt(item, 10));
    }

    if (operationRegex.test(line)) {
      const operationMatch = line.match(operationRegex)!;
      const rhs = parseInt(operationMatch[2], 10);

      args.operation = (old) => {
        const rhsNum = isNaN(rhs) ? old : rhs;

        return operationMatch[1] === '+' ? old + rhsNum : old * rhsNum;
      };
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
  shouldDivide = true,
}: SolutionArgs) => {
  await initializeMonkies();

  const limit = monkies.reduce((acc, { testNum }) => acc * testNum, 1);

  for (let round = 0; round < rounds; ++round) {
    console.log(`Doing round ${round + 1}`);

    for (const monkey of monkies) {
      for (const item of monkey.items) {
        ++monkey.inspections;
        monkey.throw(
          shouldDivide
            ? Math.floor(monkey.operation(item) / 3)
            : monkey.operation(item % limit),
        );
      }

      monkey.items = [];
    }
  }

  return monkies
    .map(({ inspections }) => inspections)
    .sort((a, b) => a - b)
    .slice(-2)
    .reduce((acc, cur) => cur * acc, 1);
};

const solution = async (args: SolutionArgs) => {
  console.log('Calculating monkey business');

  console.log(
    `Monkey business level after ${
      args.rounds
    } rounds is ${await calculateMonkeyBusiness(args)}`,
  );
};

export const solution1 = () => solution({ rounds: 20 });

export const solution2 = () =>
  solution({ rounds: 10_000, shouldDivide: false });
