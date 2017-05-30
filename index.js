'use strict'
// TODO option to not overwrite existing vars
const fs = require('fs')
const exec = require('child_process').exec
const dotenv = require('dotenv')
module.exports = (fn, options = {}) => {
	if(fn === 'pull'){
		readHerokuEnv(options)
			.then(saveDotEnv)
			.catch(console.error)
	}
	else if(fn === 'push'){
		readDotEnv(options)
			.then(saveHerokuEnv)
			.catch(console.error)
	}
}

function readDotEnv(options){
	return new Promise((resolve, reject) => {
		fs.readFile('.env', 'utf8', (err, data) => {
			if(err){
				reject('File not found or unreadable')
			}
			else{
				options.env = dotenv.parse(data)
				resolve(options)
			}
		})
	})
}
function readHerokuEnv(options){
	return new Promise((resolve, reject) => {
		exec('heroku config' + (options.app ? ` --app ${options.app}` : ''), (err, stdout, stderr) => {
			if(err) reject(err)
			else if(stderr) reject(stderr)
			else{
				stdout = stdout.split('\n')
				const arr = []
				for(let i = 0; i < stdout.length; i++){
					if(stdout[i].indexOf(':') === -1 || stdout[i].indexOf('===') === 0) continue
					let str = stdout[i].split(':')
					const key = str.shift()
					const val = str.join(':').trim()
					arr.push(`${key}="${val}"`)
				}
				options.env = arr
				resolve(options)
			}
		})
	})
}
function saveDotEnv(options){
	return new Promise((resolve, reject) => {
		fs.writeFile('.env', options.env.join('\n'), err => {
			if(err) reject(err)
			else resolve()
		})
	})
}
const regQuotes = /"/g
function saveHerokuEnv(options){
	return new Promise((resolve, reject) => {
		const arr = []
		if(options.production){
			options.env.NODE_ENV = 'production'
		}
		for(let i in options.env){
			arr.push(`${i}="${options.env[i].replace(regQuotes, '\\"')}"`)
		}
		if(!options.app) options.app = ''
		options.app = options.app.split(' ')

		const promises = []
		for(let i = options.app.length; i--;){
			promises.push(execSave(options.app[i], arr))
		}
		Promise.all(promises)
			.then(resolve)
			.catch(reject)

	})
}
function execSave(app, arr){
	app = app.trim()
	return new Promise((resolve, reject) => {
		exec(`heroku config:set ${arr.join(' ')}` + (app ? ` --app ${app}` : ''), (err, stdout, stderr) => {
			if(err) reject(err)
			else if(stderr) reject(stderr)
			else{
				if(stdout) console.log(stdout)
				resolve()
			}
		})
	})
}


function setOptions(str, opt){
	if(opt.app){
		str = `${str} --app ${opt.app}`
	}
	return str
}
