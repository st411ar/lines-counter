const startTime = new Date()
console.log('program start')

let dirsNumber = 0
let filesNumber = 0
let linesNumber = 0

const fs = require('fs')
const path = require('path')
const process = require('process')

readDir('res')

function readDir(dirName) {
	fs.opendir(dirName, 'utf-8', (err, dir) => {
		if (err) throw err
		readDirEntry(dir)
	})
}

function readDirEntry(dir) {
	dir.read((err, dirent) => {
		if (err) throw err
		if (dirent) {
			let dirPath = dir.path
			if (dirent.isDirectory()) readSubDir(dirPath, dirent)
			if (dirent.isFile()) readFile(dirPath, dirent)
			readDirEntry(dir)
		} else {
			console.log('Directory ' + dir.path + ' has bean read')
		}
	})
}

function readSubDir(dirPath, dirent) {
	dirsNumber++
	let subDirName = dirent.name
	let subDirPath = dirPath + '/' + subDirName
	console.log('sub-dir path is "' + subDirPath + '"')
	readDir(subDirPath)
}

function readFile(dirPath, dirent) {
	filesNumber++
	let fileName = dirent.name
	let filePath = path.join(__dirname, dirPath, fileName)
	readLines(filePath)
}

function readLines(filePath) {
	fs.readFile(filePath, (err, content) => {
		if (err) throw err
		let lines = content.toString().split(/\r\n|\r|\n/).length
		linesNumber += lines
		console.log('file "' + filePath + '" number of lines: ' + lines)
	})
}

process.on('exit', (code) => {
	console.log('directories: ' + dirsNumber)
	console.log('files: ' + filesNumber)
	console.log('lines: ' + linesNumber)
	let linesPerFile = Math.round(linesNumber / filesNumber)
	console.log('average lines per file: ' + linesPerFile)

	console.log('Process exit event with code: ', code)
	console.log('program exit')
	let seconds = (new Date() - startTime) / 1000
	console.log('elapsed time ' + seconds + ' seconds')
});

console.log('program stop')