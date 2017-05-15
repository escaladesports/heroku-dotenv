# heroku-dotenv

A CLI & Node.js application that copies environment variables in a .env file to and from Heroku.

## Installation

```
$ npm install --global heroku-dotenv
```

## Usage

You must first make sure you're in the directory your Heroku app is in and have the application selected in the Heroku CLI.

### Send Environment to Heroku

```
$ heroku-dotenv push
```

### Save Environment to .env File

```
$ heroku-dotenv pull
```
