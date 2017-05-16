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
				const env = dotenv.parse(data)
				resolve(env, options)
			}
		})
	})
}
function readHerokuEnv(options){
	return new Promise((resolve, reject) => {
		exec('heroku config' + (options.app ? ` -a ${options.app}` : ''), (err, stdout, stderr) => {
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
					arr.push(`${key}=${val}`)
				}
				resolve(arr, options)
			}
		})
	})
}
function saveDotEnv(env, options){
	return new Promise((resolve, reject) => {
		fs.writeFile('.env', env.join('\n'), err => {
			if(err) reject(err)
			else resolve()
		})
	})
}
function saveHerokuEnv(env, options){
	return new Promise((resolve, reject) => {
		const arr = []
		for(let i in env){
			arr.push(`${i}=${env[i]}`)
		}
		exec(`heroku config:set ${arr.join(' ')}` + (options.app ? ` -a ${options.app}` : ''), (err, stdout, stderr) => {
			if(err) reject(err)
			else if(stderr) reject(stderr)
			else{
				if(stdout) console.log(stdout)
				resolve()
			}
		})
	})
}
