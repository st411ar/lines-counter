const fs = require('fs')
const path = require('path')

let dirs = 0
let files = 0
let lines = 0
readDir('res')

function readDir(name) {
	fs.opendir(name, 'utf-8', (err, dir) => {
		if (err) throw err
		readNextDirEntry(dir)
	})
}

function readNextDirEntry(dir) {
	dir.read((err, dirEntry) => {
		if (err) throw err
		if (dirEntry) {
			if (dirEntry.isFile()) {
				files++
				readFile(path.join(__dirname, dir.path, dirEntry.name))
			}
			if (dirEntry.isDirectory()) {
				dirs++
				readDir(dir.path + '/' + dirEntry.name)
			}
			readNextDirEntry(dir)
		}
	})
}

function readFile(filePath) {
	fs.readFile(filePath, (err, content) => {
		if (err) throw err
		lines += content.toString().split(/\r\n|\r|\n/).length
	})
}

require('process').on('exit', (code) => {
	console.log('directories ' + dirs + ', files ' + files + ', lines ' + lines)
});