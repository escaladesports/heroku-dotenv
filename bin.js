#!/usr/bin/env node
const herokuDotenv = require('./index')
const meow = require('meow')
const cli = meow(`
	Usage
	  $ heroku-dotenv <function>
	Functions
	  pull:              Saves Heroku app environment variables to a .env file
	  push:              Saves contents of .env file to Heroku app
	Options
	  -a, --app          Specify the Heroku app to push to or pull from
	  -p, --production   Turns on the Node.js production environment variable
`, {
	alias: {
		a: 'app',
		p: 'production'
	}
})
herokuDotenv(cli.input[0], cli.flags)
