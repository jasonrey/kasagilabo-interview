# kasagilabo-interview

## Generate

To generate file, run:

```
node generate.js
```

### Available ENVs

* `MAX_FILE_SIZE_MB` - Maximum file size in MB, defaults to 10
* `MAX_INTEGER` - Maximum integer, defaults to JS max safe number
* `OUTPUT_FILE` - Output filename and path, defaults to `input`
* `MAX_STRING_LENGTH` - Maximum length of string, defaults 64

## Read

To read file, run:

```
node read.js
```

### Available ENVs

* `INPUT_FILE` - Input filename and path, defaults to `input`
* `OUTPUT_FILE` - Output filename and path, if not provided, result will only be printed to console and not saved to file

## Docker

### Build

Docker build only includes `read.js`. Generating input file is not included.

```
docker build -t <imagename>:<tagname> .
```

### Volumes / Mounts

* `/app/input` - Required, input file to read
* `/app/result` - Optional, result folder to store the output file, the output file defaults to `/app/result/output`

### ENVs

* `INPUT_FILE` - Defaults to `input`
* `OUTPUT_FILE` - Defaults to `/app/result/output`

### Executing

```
docker run \
  -v $PWD/input:/app/input \
  -v $PWD/result:/app/result \
  <imagename>:<tagname>
```
