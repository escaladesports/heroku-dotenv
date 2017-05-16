#!/usr/bin/env node
const herokuDotenv = require('./index')
const meow = require('meow')
const cli = meow(`
	Usage
	  $ heroku-dotenv <function>
	Functions
	  pull:      Saves Heroku app environment variables to a .env file
	  push:      Saves contents of .env file to Heroku app
	Options
	  -a, --app  Specify the Heroku app to push to or pull from
`, {
	alias: {
		a: 'app'
	}
})
herokuDotenv(cli.input[0], cli.flags)
