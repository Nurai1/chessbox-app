FROM node:20-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir /app
WORKDIR /app

# install
COPY package.json .
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


# build
COPY src ./src
COPY public ./public
COPY vite.config.ts .
COPY tailwind.config.js .
COPY .postcssrc.json .
COPY .prettierrc.json .
COPY .eslintrc.js .
COPY tsconfig.json .
COPY index.html .

RUN echo 'VITE_ENVIRONMENT=docker' > .env

RUN pnpm run build

# run the project
FROM nginx:stable-alpine

ARG HOST="chessboxingfit.com"
ENV HOST ${HOST}

ARG POST=80
ENV POST ${POST}

RUN mkdir /app/

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/nginx.tmp.conf /etc/nginx/conf.d/nginx.tmp.conf

RUN envsubst '\$HOSTS' < /etc/nginx/conf.d/nginx.tmp.conf > /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/nginx.tmp.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
