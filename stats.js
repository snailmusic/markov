const fs = require("node:fs")

let data_str = fs.readFileSync("data.txt").toString()
let data_split = data_str.split("\n")

let probdata = JSON.parse(fs.readFileSync("prob.json").toString())

let avg_len = 0
let max_len = 0
let min_len = 1000
for (const element of data_split) {
	let len = element.length
    avg_len += len
	max_len = Math.max(len, max_len)
	min_len = Math.min(len, min_len)
}
avg_len /=  data_split.length

let sum = 0
let mean_len = probdata.lengths.map((elem) => {
	let temp = elem.prob - sum
	sum = elem.prob
	return {
		val: elem.val,
		prob: temp
	}
}).reduce((prev, elem) => {
	return prev.prob >= elem.prob ? prev : elem 
}).val

sum = 0
let common_start = probdata.starts.map((elem) => {
	let temp = elem.prob - sum
	sum = elem.prob
	return {
		val: elem.val,
		prob: temp
	}
}).reduce((prev, elem) => {
	return prev.prob >= elem.prob ? prev : elem 
}).val

console.log(JSON.stringify({
	"min len": min_len,
	"max len": max_len,
	"avg len": avg_len,
	"mean len": mean_len,
	"most common start": common_start
}))