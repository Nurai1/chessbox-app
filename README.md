# chessbox-app

Project in NodeJs, MongoDB, Express and React. It is the app for business that helps organizing sport competition.

## Run the Project in docker

> First of all you need to install `docker compose` and `gcloud`.

### Setup the environment

```bash
gcloud auth login
gcloud config set project my-project-1550874636271
gcloud compute ssh instance-warsaw-chessbox --zone europe-central2-c
gcloud auth configure-docker europe-north1-docker.pkg.dev
docker login europe-north1-docker.pkg.dev
```

### Select an environment

```bash
export DENV=dev # or prod
```

> You need to set the `DENV` variable every time you want to work with docker

### Pull docker images

```bash
docker compose pull
```

### Run the project

```bash
docker compose up -d
```

### Build the project

```bash
export MODE=ssl
export JWT_SECRET_KEY="..."
export MONGO_URI="..."
export PROJECT_PORT=80 
export PROJECT_SSL_PORT=443 
export SMTP_USER_MAIL="..." 
export SMTP_SERVICE_PASSKEY="..." 

docker compose build
```

### Push docker images to google artifacts

```bash
docker compose push
```

## SSL

To start the project with ssl you need to rebuild `gateway` service and setup `certbot`.

### Start ssl mode

To start the project in ssl mode you need to set `MODE` variable and follow instructions in the [Run the Project in docker](#run-the-project-in-docker) section.

```bash
export MODE=ssl
```

### Setup Cerbot

Init a new cert (use it for a new project only)

```bash
sh setup-certbot.sh  # init new cert
```

Start cert renewal service

```
sh start-certbot.sh  # auto renewal
```

Restart gateway

```bash
docker compose exec gateway nginx -s reload
```
Old SSL INFO:
For changing ssl keys:
In certbot/conf/live/chessboxingfit.com change keys.

Convert keys:
cat certificate.crt ca_bundle.crt > fullchain.pem
cp private.key privkey.pem

