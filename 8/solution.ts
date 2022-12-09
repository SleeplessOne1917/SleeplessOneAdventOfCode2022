import { join } from 'path';
import { open } from 'fs/promises';

const getTreeGrid = async () => {
  const file = await open(join('8', 'input.txt'));
  const treeGrid: number[][] = [];

  for await (const line of file.readLines()) {
    treeGrid.push([...line].map((t) => parseInt(t, 10)));
  }

  return treeGrid;
};

const checkIsTreeVisible = (coords: [number, number], treeGrid: number[][]) => {
  const [row, col] = coords;
  const tree = treeGrid[row][col];

  // Tree is on the edge
  if (
    col === 0 ||
    row === 0 ||
    row === treeGrid.length - 1 ||
    col === treeGrid[row].length - 1
  ) {
    return true;
  }

  // Check south
  const southTrees: number[] = [];
  for (let i = row + 1; i < treeGrid.length; ++i) {
    southTrees.push(treeGrid[i][col]);
  }

  // Check north
  const northTrees: number[] = [];
  for (let i = row - 1; i >= 0; --i) {
    northTrees.push(treeGrid[i][col]);
  }

  // Check east
  const eastTrees: number[] = [];
  for (let i = col + 1; i < treeGrid[row].length; ++i) {
    eastTrees.push(treeGrid[row][i]);
  }

  // Check west
  const westTrees: number[] = [];
  for (let i = col - 1; i >= 0; --i) {
    westTrees.push(treeGrid[row][i]);
  }

  return (
    southTrees.every((st) => st < tree) ||
    northTrees.every((nt) => nt < tree) ||
    eastTrees.every((et) => et < tree) ||
    westTrees.every((wt) => wt < tree)
  );
};

export const solution1 = async () => {
  console.log('Counting trees visible outside the grid.');

  const treeGrid = await getTreeGrid();

  const numberOfVisibleTrees = treeGrid.reduce(
    (rowAcc, rowCur, row) =>
      rowAcc +
      rowCur.reduce(
        (colAcc, _, col) =>
          colAcc + (checkIsTreeVisible([row, col], treeGrid) ? 1 : 0),
        0
      ),
    0
  );

  console.log(`There are ${numberOfVisibleTrees} visible trees.`);
};

const calculateScenicScore = (
  coords: [number, number],
  treeGrid: number[][]
) => {
  const [row, col] = coords;
  const tree = treeGrid[row][col];

  // Check south
  let southDistance = 0;
  for (let i = row + 1; i < treeGrid.length; ++i) {
    ++southDistance;

    if (treeGrid[i][col] >= tree) {
      break;
    }
  }

  // Check north
  let northDistance = 0;
  for (let i = row - 1; i >= 0; --i) {
    ++northDistance;

    if (treeGrid[i][col] >= tree) {
      break;
    }
  }

  // Check east
  let eastDistance = 0;
  for (let i = col + 1; i < treeGrid[row].length; ++i) {
    ++eastDistance;

    if (treeGrid[row][i] >= tree) {
      break;
    }
  }

  // Check west
  let westDistance = 0;
  for (let i = col - 1; i >= 0; --i) {
    ++westDistance;

    if (treeGrid[row][i] >= tree) {
      break;
    }
  }

  return southDistance * northDistance * eastDistance * westDistance;
};

export const solution2 = async () => {
  console.log('Finding highest scenic score.');
  const treeGrid = await getTreeGrid();

  const highestScore = treeGrid.reduce((rowAcc, rowCur, row) => {
    const rowHighest = rowCur.reduce((colAcc, _, col) => {
      const score = calculateScenicScore([row, col], treeGrid);

      return score > colAcc ? score : colAcc;
    }, 0);

    return rowHighest > rowAcc ? rowHighest : rowAcc;
  }, 0);

  console.log(`The highest scenic score is: ${highestScore}`);
};
