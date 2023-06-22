This is a [Next.js](https://nextjs.org/) project.

## Getting Started

You can use docker-compose to start app easily.

First of all, install [docker-compose](https://docs.docker.com/compose/install/) if you don't have it on your machine. Make sure you follow all prerequisites.

Secondly, you must create .env file in the root folder with content like this:

```dotenv
# Services Urls
NEXT_PUBLIC_FRONT_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://meetlane-api-dev:3030

# TON Configuration
NEXT_PUBLIC_TONSCAN_URL=https://tonscan.org
NEXT_PUBLIC_TONAPI_URL=https://tonapi.io/v1
TONAPI_TOKEN=eyJhbGc...

# First TURN server info
NEXT_PUBLIC_TURN_URL=turn:00.000.000.000:3478
NEXT_PUBLIC_TURN_USERNAME=your_username
NEXT_PUBLIC_TURN_PASSWORD=your_turn_password

# Second TURN server info
NEXT_PUBLIC_TURN_SECOND_URL=turn:00.000.000.000:3478
NEXT_PUBLIC_TURN_SECOND_USERNAME=your_username
NEXT_PUBLIC_TURN_SECOND_PASSWORD=your_password

# STUN servers info
NEXT_PUBLIC_STUN_URL=stun:00.000.000.000:80
NEXT_PUBLIC_STUN_SECOND_URL=stun:00.000.000.000:80
```

After that, you should place compiled [smart-contract](https://github.com/turtletongue/yotemi_contracts) of interview into ./contract/compiled folder. This file must be called `interview.cell`.

Now, you can execute this command:

```shell
# build containers and run application
docker-compose up
```

If you want to stop containers, just use:

```shell
docker-compose stop
```

If you want to remove containers, use:

```shell
docker-compose down
```

## Project Structure

`./app` folder contains all pages.

`./components` folder contains useful components - building blocks of pages.

`./contract` folder contains TON smart-contract related logic.

`./hooks` folder contains useful hooks.

`./i18n` folder contains translation for pages.

`./store` folder contains logic for making requests and caching their results.

`./utils` folder contains many useful functions.
