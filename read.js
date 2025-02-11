const fs = require('node:fs');

const INPUT_FILE = process.env.INPUT_FILE ?? 'input';
const OUTPUT_FILE = process.env.OUTPUT_FILE;

const stream = fs.createReadStream(INPUT_FILE);

let value = '';
let outputStream;

if (OUTPUT_FILE) {
  outputStream = fs.createWriteStream(OUTPUT_FILE);
}

function evaluate(input) {
  const result = input.trim();

  if (!result) {
    return [];
  }

  // real number
  if (result.includes('.')) {
    return [result, 'real number'];
  }

  // integer
  if (!Number.isNaN(Number(result))) {
    return [result, 'integer'];
  }

  // alphanumeric
  if (/[0-9]/.test(result)) {
    return [result, 'alphanumeric'];
  }

  // alphabetical
  return [result, 'alphabetical'];
}

function save(result) {
  if (!result.length) {
    return;
  }

  const line = evaluate(result).join(' - ');
  console.log(line);

  if (outputStream) {
    outputStream.write(`${line}\n`);
  }
}

stream.on('error', (error) => {
  if (error.code === 'ENOENT') {
    console.error(`File not found: ${INPUT_FILE}`);
    console.log(
      'Check the values for env.INPUT_FILE or ensure volume is mounted correctly to the Docker container'
    );
    return;
  }

  console.error(error);
});

stream.on('data', (chunk) => {
  const string = chunk.toString();

  if (string.includes(',')) {
    const segments = string.split(',');
    const lastValue = segments.pop();

    segments[0] = value + segments[0];

    segments.forEach(save);

    value = lastValue;

    return;
  }

  value += string;
});

stream.on('end', () => {
  save(value);

  if (outputStream) {
    outputStream.end();
  }
});
