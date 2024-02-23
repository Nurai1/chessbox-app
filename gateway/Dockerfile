FROM nginx:stable-alpine

ARG HOST="chessboxingfit.com"
ENV HOST ${HOST}

ARG CLIENT_URI=http://client:80
ENV CLIENT_URI ${CLIENT_URI}

ARG SERVER_URI=http://server:80
ENV SERVER_URI ${SERVER_URI}

COPY nginx/nginx.tmp.conf /etc/nginx/conf.d/nginx.tmp.conf

RUN envsubst '\$CLIENT_URI \$SERVER_URI \$HOST' < /etc/nginx/conf.d/nginx.tmp.conf > /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/nginx.tmp.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
