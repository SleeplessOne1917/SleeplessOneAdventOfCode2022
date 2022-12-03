import { join } from "path";
import { open } from "fs/promises";

const caclulatePriority = (item: string) => {
  const charCode = item.charCodeAt(0);

  if (charCode >= 65 && charCode <= 90) {
    return charCode - 38;
  }

  if (charCode >= 97 && charCode <= 122) {
    return charCode - 96;
  }

  return 0;
};

const prioritizeRucksack = (rucksack: string) => {
  const compartment1 = new Set([
    ...rucksack.slice(0, Math.floor(rucksack.length / 2)),
  ]);
  const compartment2 = new Set([
    ...rucksack.slice(-Math.floor(rucksack.length / 2)),
  ]);

  return [...compartment1].reduce(
    (acc, cur) => (compartment2.has(cur) ? acc + caclulatePriority(cur) : acc),
    0
  );
};

export const solution1 = async () => {
  console.log("Caclulating priorities of mis-packed rucksack items");
  const file = await open(join("3", "input.txt"));

  let totalPriority = 0;

  for await (const line of file.readLines()) {
    totalPriority += prioritizeRucksack(line);
  }

  console.log(`Total rucksack priority: ${totalPriority}`);
};

const divideIntoGroups = (rucksacks: string[]) =>
  rucksacks.reduce<string[][]>(
    (acc, cur) =>
      acc[acc.length - 1].length === 3
        ? [...acc, [cur]]
        : [...acc.slice(0, acc.length - 1), [...acc[acc.length - 1], cur]],
    [[]]
  );

const prioritizeGroup = (group: string[]) => {
  const [firstRucksack, ...otherRucksacks] = group.map((r) => new Set([...r]));

  for (const item of firstRucksack) {
    if (otherRucksacks.every((r) => r.has(item))) {
      return caclulatePriority(item);
    }
  }

  return 0;
};

export const solution2 = async () => {
  console.log("Caclulating priorities of group badges");
  const file = await open(join("3", "input.txt"));

  const lines = [];

  for await (const line of file.readLines()) {
    lines.push(line);
  }

  const groups = divideIntoGroups(lines);

  let totalPriority = 0;

  for (const group of groups) {
    totalPriority += prioritizeGroup(group);
  }

  console.log(`Total group priority: ${totalPriority}`);
};
