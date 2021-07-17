## Description

Project based on [skymp](https://github.com/skyrim-multiplayer/skymp)

## Launch server

if you only want to run the server without development, then you need to use the server folder.

- in server folder rename server-settings.example.json to server-settings.json and configure your server (replace if exists)
- in server folder rename server-settings.example.json to server-settings.json and configure your server
- copy Dawnguard.esm, Dragonborn.esm, HearthFires.esm, Skyrim.esm, Update.esm from skyrim folder to server data folder
- in server folder unzip the scripts.zip to the server/data/scripts folder

to start your server use `npm run server:start` in root folder in repo, or `npm start` in server folder

## Server documentation

See documentation about server-settings [skymp5-docs](https://github.com/skyrim-multiplayer/skymp/tree/main/docs)

But our server has a couple of its own settings [link](docs/server-configuration.md)

## Server options

In our project we have new options for server server-options.json

Documentation about server-options [link](docs/server-options.md)

## Front documentation

See our documentation for front [link](https://www.notion.so/SKYMP-FRONTEND-f7eed0904d1240ad95166b574f7f33b5)

## Installation for DEV

- install lates stable node js version
- install [Papyrus lang for VS Code](https://marketplace.visualstudio.com/items?itemName=joelday.papyrus-lang-vscode)
- in folder .vscode rename tasks.example.json to tasks.json (replace if exists)
- in folder .vscode rename settings.example.json to settings.json (replace if exists)
- change papyrus.skyrimSpecialEdition.installPath in settings.json to absolute path for compiler folder
- in server folder rename server-settings.example.json to server-settings.json and configure your server (replace if exists)
- copy Dawnguard.esm, Dragonborn.esm, HearthFires.esm, Skyrim.esm, Update.esm from skyrim folder to server data folder
- in server folder unzip the scripts.zip to the server/data/scripts folder
- run `npm install` to install required dependencies

## Running the server

```bash
$ npm run server:start
```

## Running the ts script compilation

```bash
$ npm run functions:serve
```

## Running the papyrus script compilation

```bash
npm run compile
```

or combination ctrl + shit + B

## Parse all esp files to find localization

```bash
npm run parse:all
```

## Running the client compilation

```bash
npm run client:watch
```

## Running the front compilation

```bash
npm run front:build
```

All commands see in package.json
