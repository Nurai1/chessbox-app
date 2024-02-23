# chessbox-app

Project in NodeJs, MongoDB, Express and React. It is the app for business that helps organizing sport competition.

## Run Docker

> First of all you need to install `docker compose` and `gcloud`.

### Setup the environment

```bash
gcloud auth login
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
docker-compose pull
```

### Run the project

```bash
docker-compose up -d
```

### Build the project

```bash
export PROJECT_PORT=80 
export SMTP_USER_MAIL="..." 
export SMTP_SERVICE_PASSKEY="..." 

docker-compose build
```

### Push docker images from google artifacts

```bash
docker-compose push
```
