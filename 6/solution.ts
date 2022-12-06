import { join } from "path";
import { open } from "fs/promises";

const charactersAreDifferent = (characters: string[]) =>
  characters.reduce<{ different: boolean; examined: string[] }>(
    (acc, cur) =>
      acc.examined.includes(cur)
        ? {
            different: false,
            examined: [...acc.examined, cur],
          }
        : { ...acc, examined: [...acc.examined, cur] },
    {
      different: true,
      examined: [],
    }
  ).different;

const getStart = (signal: string, numberOfDifferentCharacters: number) => {
  let candidateMarker: string[] = [];

  let position = 1;

  for (const character of signal) {
    if (candidateMarker.length < numberOfDifferentCharacters) {
      candidateMarker.push(character);
    } else {
      const [discard, ...rest] = candidateMarker;
      candidateMarker = [...rest, character];

      if (charactersAreDifferent(candidateMarker)) {
        return position;
      }
    }

    ++position;
  }
};

const getSignal = async () => {
  const file = await open(join("6", "input.txt"));

  try {
    return await file.readFile();
  } finally {
    file.close();
  }
};

const getPacketStart = (signal: string) => getStart(signal, 4);

const getMessageStart = (signal: string) => getStart(signal, 14);

export const solution1 = async () => {
  console.log("Processing signal for start of packet marker");

  const signal = await getSignal();

  const packetStartPosition = getPacketStart(signal.toString());

  console.log(`Packet starts at ${packetStartPosition}`);
};

export const solution2 = async () => {
  console.log("Processing signal for start of message marker");

  const signal = await getSignal();

  const messageStartPosition = getMessageStart(signal.toString());

  console.log(`Message starts at ${messageStartPosition}`);
};
