import { join } from 'path';
import { open } from 'fs/promises';

const commandRegex = /\$\s+(cd|ls)(?:\s+(\S+))?/;
const cdFromRootRegex = /\//;
const cdToParentRegex = /\.\./;
const dirRegex = /^dir\s+(\S+)/;
const fileRegex = /^(\d+)\s+([A-Za-z\d]+(?:\.[A-Za-z\d]{1,4})?)/;

type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  children: (File | Directory)[];
};

const addChildToDirectory = (
  directory: Directory,
  path: string[],
  child: Directory | File
) => {
  if (path.length === 0) {
    directory.children.push(child);
  } else {
    const recurseDirectory = directory.children.find(
      (child) => child.name === path[0] && (child as Directory).children
    ) as Directory | undefined;

    if (recurseDirectory) {
      const [_, ...restPath] = path;

      addChildToDirectory(recurseDirectory, restPath, child);
    } else {
      throw new Error('Path does not match directory');
    }
  }
};

const createDirectoryStructure = async () => {
  const file = await open(join('7', 'input.txt'));
  const rootDirectory: Directory = {
    name: 'root',
    children: [],
  };
  let pathParts: string[] = [];

  for await (const line of file.readLines()) {
    const commandMatch = line.match(commandRegex);

    if (commandMatch) {
      if (commandMatch[1] === 'cd') {
        if (cdFromRootRegex.test(commandMatch[2])) {
          pathParts = [];
        } else if (cdToParentRegex.test(commandMatch[2])) {
          pathParts.pop();
        } else {
          pathParts.push(commandMatch[2]);
        }
      }
    } else {
      const dirMatch = line.match(dirRegex);

      if (dirMatch) {
        addChildToDirectory(rootDirectory, pathParts, {
          name: dirMatch[1],
          children: [],
        } as Directory);
      } else {
        const fileMatch = line.match(fileRegex)!;

        addChildToDirectory(rootDirectory, pathParts, {
          name: fileMatch[2],
          size: parseInt(fileMatch[1], 10),
        } as File);
      }
    }
  }

  return rootDirectory;
};

const getDirectorySize = (directory: Directory): number => {
  const subFiles: File[] = [];
  const subDirectories: Directory[] = [];

  if (directory.children.length === 0) {
    return 0;
  }

  for (const child of directory.children) {
    if ((child as File).size || (child as File).size === 0) {
      subFiles.push(child as File);
    } else {
      subDirectories.push(child as Directory);
    }
  }

  return (
    subFiles.reduce((acc, cur) => acc + cur.size, 0) +
    subDirectories.reduce((acc, cur) => acc + getDirectorySize(cur), 0)
  );
};

const sumDirectories = (directory: Directory): number => {
  if (directory.children.length === 0) {
    return 0;
  }

  const curDirectorySize = getDirectorySize(directory);

  return (
    (curDirectorySize <= 100000 ? curDirectorySize : 0) +
    directory.children.reduce(
      (acc, cur) =>
        (cur as Directory).children
          ? sumDirectories(cur as Directory) + acc
          : acc,
      0
    )
  );
};

export const solution1 = async () => {
  console.log('Calculating sum of directories of size less than 100000');
  const rootDirectory = await createDirectoryStructure();

  console.log(`The sum is ${sumDirectories(rootDirectory)}`);
};

const totalDiskSpace = 70000000;
const requiredDiskSpace = 30000000;

const findSmallestToDelete = (directory: Directory) => {
  const unusuedSpace = totalDiskSpace - getDirectorySize(directory);
  const spaceToDelete = requiredDiskSpace - unusuedSpace;

  const findSmallestRec = (dir: Directory, currentSmallest?: Directory) => {
    const size = getDirectorySize(dir);

    let smallest =
      !currentSmallest ||
      (size < getDirectorySize(currentSmallest) && size >= spaceToDelete)
        ? dir
        : currentSmallest;

    for (const child of dir.children) {
      if ((child as Directory).children) {
        smallest = findSmallestRec(child as Directory, smallest);
      }
    }

    return smallest;
  };

  return getDirectorySize(findSmallestRec(directory));
};

export const solution2 = async () => {
  console.log('Finding smallest directory to delete.');
  const rootDirectory = await createDirectoryStructure();

  console.log(
    `Smallest size to delete is ${findSmallestToDelete(rootDirectory)}`
  );
};
