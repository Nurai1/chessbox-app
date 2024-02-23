FROM node:20-slim AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

ARG CLIENT_URL="chessboxingfit.com"
ENV CLIENT_URL ${CLIENT_URL}

ARG SMTP_USER_MAIL=""
ENV SMTP_USER_MAIL ${SMTP_USER_MAIL}

ARG SMTP_SERVICE_PASSKEY=""
ENV SMTP_SERVICE_PASSKEY ${SMTP_SERVICE_PASSKEY}

ENV PORT 80
EXPOSE 80

CMD [ "node", "dist/index.js" ]
