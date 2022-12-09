import { join } from 'path';
import { open } from 'fs/promises';

const moveRegex = /(R|U|D|L)\s(\d+)/;

type Point = {
  x: number;
  y: number;
};

const knotsTouching = (head: Point, tail: Point) =>
  (head.x === tail.x && head.y === tail.y) ||
  (tail.x === head.x - 1 && tail.y === head.y - 1) ||
  (tail.x === head.x && tail.y === head.y - 1) ||
  (tail.x === head.x + 1 && tail.y === head.y - 1) ||
  (tail.x === head.x - 1 && tail.y === head.y) ||
  (tail.x === head.x + 1 && tail.y === head.y) ||
  (tail.x === head.x - 1 && tail.y === head.y + 1) ||
  (tail.x === head.x && tail.y === head.y + 1) ||
  (tail.x === head.x + 1 && tail.y === head.y + 1);

const moveKnot = (head: Point, tail: Point) => {
  if (knotsTouching(head, tail)) {
    return;
  }

  if (head.x !== tail.x) {
    tail.x += head.x > tail.x ? 1 : -1;
  }

  if (head.y !== tail.y) {
    tail.y += head.y > tail.y ? 1 : -1;
  }
};

const calculateNumberOfPlacesTailVisits = async (knots: number) => {
  const file = await open(join('9', 'input.txt'));

  const visitedPoints: Point[] = [{ x: 0, y: 0 }];

  const currentPoints = [...Array(knots).keys()].map<Point>(() => ({
    x: 0,
    y: 0,
  }));

  const tail = currentPoints[knots - 1];

  for await (const line of file.readLines()) {
    const lineMatch = line.match(moveRegex)!;
    const direction = lineMatch[1];
    const units = parseInt(lineMatch[2], 10);

    const doMoves = (handleHead: () => void) => {
      for (let i = 0; i < units; ++i) {
        handleHead();

        for (let i = 0; i < currentPoints.length; ++i) {
          if (i < currentPoints.length - 1) {
            moveKnot(currentPoints[i], currentPoints[i + 1]);
          }
        }

        if (
          !visitedPoints.some(
            (point) => point.x === tail.x && point.y === tail.y
          )
        ) {
          visitedPoints.push({ ...tail });
        }
      }
    };

    switch (direction) {
      case 'D':
        doMoves(() => {
          --currentPoints[0].y;
        });
        break;
      case 'U':
        doMoves(() => {
          ++currentPoints[0].y;
        });
        break;
      case 'R':
        doMoves(() => {
          ++currentPoints[0].x;
        });
        break;
      case 'L':
        doMoves(() => {
          --currentPoints[0].x;
        });
        break;
    }
  }

  return visitedPoints.length;
};

const solution = async (knots: number) => {
  console.log(
    `Finding number of points tail of rope with ${knots} knots visits`
  );

  console.log(
    `Rope visits ${await calculateNumberOfPlacesTailVisits(knots)} points`
  );
};

export const solution1 = async () => await solution(2);

export const solution2 = async () => await solution(10);
