import { join } from "path";
import { open } from "fs/promises";

const sectionRangeRegex = /(\d+)-(\d+)/;

const getRangeNumbers = (line: string) => {
  const [range1, range2] = line.split(",");

  const range1Match = range1.match(sectionRangeRegex) as RegExpMatchArray;
  const range1Start = parseInt(range1Match[1], 10);
  const range1End = parseInt(range1Match[2], 10);

  const range2Match = range2.match(sectionRangeRegex) as RegExpMatchArray;
  const range2Start = parseInt(range2Match[1], 10);
  const range2End = parseInt(range2Match[2], 10);

  return { range1Start, range1End, range2Start, range2End };
};

export const solution1 = async () => {
  console.log("Finding section ranges that contain other section ranges.");
  const file = await open(join("4", "input.txt"));

  let containingSections = 0;

  for await (const line of file.readLines()) {
    const { range1End, range1Start, range2End, range2Start } =
      getRangeNumbers(line);

    if (
      (range2Start >= range1Start && range2End <= range1End) ||
      (range1Start >= range2Start && range1End <= range2End)
    ) {
      containingSections += 1;
    }
  }

  console.log(
    `Sections ranges containing other section ranges: ${containingSections}`
  );
};

export const solution2 = async () => {
  console.log("Finding section ranges that overlap.");
  const file = await open(join("4", "input.txt"));

  let overlappingSections = 0;

  for await (const line of file.readLines()) {
    const { range1End, range1Start, range2End, range2Start } =
      getRangeNumbers(line);

    if (
      (range1Start >= range2Start && range1Start <= range2End) ||
      (range2Start >= range1Start && range2Start <= range1End)
    ) {
      overlappingSections += 1;
    }
  }

  console.log(`Overlapping section ranges: ${overlappingSections}`);
};
