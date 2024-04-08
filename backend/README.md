# Proof of attendance prebuilt solution - backend

This repository contains source code for POA APIs.

## Getting Started

This repository is configured to run with `npm`.

### Prerequisites

- Node.js v18.16.0 or higher
- npm v8.4.0 or higher
- Mysql database
- SMTP mail server

### Run locally

First setup environment variables as described below then run:

```sh
npm install
npm run dev
```

### Endpoints

| Route                                    | Description                                                                  | Authentication required |
| ---------------------------------------- | ---------------------------------------------------------------------------- | ----------------------- |
| `/login`                                 | Admin wallet login                                                           | false                   |
| `/poap-drops`                            | CRUD endpoints for POA drops                                                 | true                    |
| `/nft-collections`                       | Endpoint to get collections from Apillon platform                            | true                    |
| `/poap-drops/:id/drop-reservation-token` | Endpoint to generate jwt for reservation (qr code)                           | true                    |
| `/poap-drops/:id/reserve-drop`           | Endpoint to reserve nft drop. User recieves email with instructions for mint | true (token from email) |
| `/claim`                                 | Endpoint for claim - Mint NFT to specified wallet address                    | true (token from email) |

## Environment variables

For local development and running app you will need to configure some environment variables. List of all supported vars can be found in [`/src/config/env.ts`](./src/config/env.ts).

For local development you should create `.env` file. To run this app in Docker, you can create `.env.deploy` and `.env.sql.deploy` and use provided [`docker-compose.yml`](./docker-compose.yml)

### .env

For running locally, create new `.env` file in project root folder (`backend/`) and set at least all the variables (probably with different values) as in `.env.deploy` file described bellow.

### .env.deploy

For running a docker image with [`docker-compose.yml`](./docker-compose.yml) you should create `.env.deploy` file like this example:

```sh

MYSQL_HOST: mysql # DB host (container name or ip/url)
MYSQL_DB: poa
MYSQL_USER: root
MYSQL_PASSWORD: Pa55worD?! # set your DB password (same as in .env.sql.deploy)

APP_URL: 'http://your-custom-url.com'  # set URL of your frontend application
ADMIN_WALLET: # your EVM wallet address

# Apillon configuration
# Create (free) account at https://apillon.io to and setup API key and NFT collection
APILLON_KEY: # Apillon api key
APILLON_SECRET: # Apillon api key secret

# Your email server configuration
SMTP_HOST:
SMTP_PORT: '465'
SMTP_USERNAME:
SMTP_PASSWORD:
SMTP_EMAIL_FROM:
SMTP_NAME_FROM: 'NFT Airdrop'

# API configuration (you can just live it as it is or appropriate fix dockerfile and compose)
API_HOST: 0.0.0.0
API_PORT: 3000
```

### .env.sql.deploy

For running a mysql docker image with [`docker-compose.yml`](./docker-compose.yml) you should create `.env.sql.deploy` file like this:

```sh
MYSQL_ROOT_PASSWORD: Pa55worD?! # set your DB password (same as in .env.deploy)
MYSQL_DATABASE: poa

```

## Deploying with docker

Build docker image with script [`./build-image.sh`](./build-image.sh) script or by running docker build command, for example:

```sh
docker build -t ps-poa .
docker tag ps-poa ps-poa:latest
```

If you correctly setup .env files, you can run app in docker by running

```sh
docker compose up -d
```

## Automated testing

In this prebuilt solution, we have limit our automated tests to basic end-to-end tests. Default testing framework for this project is [Jest](https://jestjs.io/docs/en/getting-started). Test are written in `tests` directory.

For running tests, check if all environment variables with suffix `_TEST` are correctly set. If running locally, variables should be set in your `.env` file in root folder.

```yml
# TEST config
MYSQL_HOST_TEST: 127.0.0.1
MYSQL_DB_TEST: Poap_test
MYSQL_USER_TEST:
MYSQL_PASSWORD_TEST:
MYSQL_POOL_TEST: 20
```

### Running API tests

```ssh
npm run test
```

To run single test

```ssh
npm run test -- <search pattern>
```

> note the blank space after `--`

Search pattern is used to find file with test. You may use filename or part of filename, for example `login.test`
