import { FileHandle, open } from "fs/promises";

import { join } from "path";

const crateRegex = /(\[[A-Z]\]|\s{3})\s?/g;
const moveRegex = /move (\d+) from (\d+) to (\d+)/;
const letterRegex = /([A-Z])/;

type CraneMode = "one-by-one" | "group";

const getLines = async (file: FileHandle) => {
  const lines: string[] = [];

  for await (const line of file.readLines()) {
    lines.push(line);
  }

  return lines;
};

const moveCratesOneByOne = (
  numCrates: number,
  fromStack: string[],
  toStack: string[]
) => {
  for (let i = 0; i < numCrates; ++i) {
    const crate = fromStack.pop();

    toStack.push(crate as string);
  }
};

const moveCratesByGroup = (
  numCrates: number,
  fromStack: string[],
  toStack: string[]
) => {
  const group = fromStack.slice(-numCrates);
  group.forEach(() => {
    fromStack.pop();
  });

  toStack.push(...group);
};

const populateStacks = (stacks: string[][], lines: string[]) => {
  for (const line of lines) {
    if (crateRegex.test(line)) {
      const crates = line.match(crateRegex)!;

      crates.forEach((crate, i) => {
        if (letterRegex.test(crate)) {
          const letter = crate.match(letterRegex)![1];
          stacks[i] = [letter, ...stacks[i]];
        }
      });
    }
  }
};

const organizeCrates = (
  stacks: string[][],
  lines: string[],
  mode: CraneMode
) => {
  const moveCrates = mode === "group" ? moveCratesByGroup : moveCratesOneByOne;

  for (const line of lines) {
    if (moveRegex.test(line)) {
      const moveMatch = line.match(moveRegex)!;
      const numCrates = parseInt(moveMatch[1], 10);
      const fromIndex = parseInt(moveMatch[2], 10);
      const toIndex = parseInt(moveMatch[3], 10);

      moveCrates(numCrates, stacks[fromIndex - 1], stacks[toIndex - 1]);
    }
  }
};

const solution = async (mode: CraneMode) => {
  console.log("Organizing crates");
  const file = await open(join("5", "input.txt"));

  const stacks = [...Array(9).keys()].map<string[]>(() => []);

  const lines = await getLines(file);

  populateStacks(stacks, lines);

  organizeCrates(stacks, lines, mode);

  const topsString = stacks.map((stack) => stack[stack.length - 1]).join("");

  console.log(`The tops of each crate stack are ${topsString}`);
};

export const solution1 = async () => await solution("one-by-one");

export const solution2 = async () => await solution("group");
