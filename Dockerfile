FROM node:22-alpine

WORKDIR /app

RUN mkdir /app/result

COPY read.js .

ENV OUTPUT_FILE=/app/result/output

CMD ["node", "read.js"]
