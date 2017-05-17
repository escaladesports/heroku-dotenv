# heroku-dotenv

A CLI & Node.js application that copies environment variables in a .env file to and from Heroku.

## Installation

```
$ npm install --global heroku-dotenv
```

## Usage

You must first make sure you're in the directory your Heroku app is in and have the application selected in the Heroku CLI.

### Send Environment to Heroku

```bash
$ heroku-dotenv push
```

### Save Environment to .env File

```bash
$ heroku-dotenv pull
```

### Options

#### -a, -app
Pushes/pulls from the specified Heroku app.

```bash
$ heroku-dotenv pull -a my-heroku-app
```

#### -p, --production
Turns on the Node.js production environment variable.

```bash
$ heroku-dotenv push -p
```
