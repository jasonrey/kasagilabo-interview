const fs = require('node:fs');

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE_MB ?? 10) * 1024 * 1024;
const MAX_INTEGER = Number(process.env.MAX_INTEGER ?? Number.MAX_SAFE_INTEGER);
const OUTPUT_FILE = process.env.OUTPUT_FILE ?? 'input';
const MAX_STRING_LENGTH = Number(process.env.MAX_STRING_LENGTH ?? 64);
const ALPHABETICAL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMERIC = '0123456789';
const REGEX_ALPHA_NUMERIC = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
const outputStream = fs.createWriteStream(OUTPUT_FILE);

function randomPositiveInteger() {
  const value = randomInteger(1, MAX_INTEGER);

  return Number(value.toString().slice(0, randomStringLength(1, 9)));
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStringLength(min = 1, max = MAX_STRING_LENGTH) {
  return randomInteger(min, max);
}

function randomString(
  length = randomStringLength(),
  characters = ALPHABETICAL
) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[randomInteger(0, characters.length - 1)];
  }
  return result;
}

function randomResult(set) {
  return set[randomInteger(0, set.length - 1)];
}

function randomSpaces() {
  return new Array(randomInteger(1, 10)).fill(' ').join('');
}

const outputGenerators = [
  function alphabeticalStrings() {
    return randomString();
  },
  function realNumbers() {
    return Math.random() * randomPositiveInteger();
  },
  function integers() {
    return randomPositiveInteger() * randomResult([-1, 1]);
  },
  function alphaNumerics() {
    let result;

    do {
      result = randomString(randomStringLength(2), ALPHABETICAL + NUMERIC);
    } while (!REGEX_ALPHA_NUMERIC.test(result));

    return randomSpaces() + result + randomSpaces();
  },
];

function write(isLast = false) {
  const value = randomResult(outputGenerators)().toString();

  outputStream.write(`${value}${isLast ? '' : ','}`);

  return value.length;
}

let bytesWritten = 0;

outputStream.on('ready', () => {
  while (bytesWritten < MAX_FILE_SIZE) {
    bytesWritten += write() + 1;
  }

  write(true);
  outputStream.end();
});
