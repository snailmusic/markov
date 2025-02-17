const fs = require("node:fs")

function toWindows(inputArray, size) {
    return Array.from(
      {length: inputArray.length - (size - 1)}, //get the appropriate length
      (_, index) => inputArray.slice(index, index+size) //create the windows
    )
}

let data_str = fs.readFileSync("data.txt").toString()
let data_split = data_str.split("\n")
data_str = [...data_str].filter((val) => val != '\n').join("")

let mapping_prereq = toWindows(data_str, 2)

let mapping = mapping_prereq.reduce((mapping, item) => {
    let first_char = item.at(0)
    let second_char = item.at(1)
    if (mapping[first_char] == undefined) {
      mapping[first_char] = {}
    }
    if (mapping[first_char][second_char] == undefined) {
      mapping[first_char][second_char] = 0
    }
    mapping[first_char][second_char] += 1
    return mapping
}, {})

let probs_obj = {
    "letters": {},
    "starts": {},
    "lengths": {}
}

// letter prob gen
for (const from in mapping) {
    if (Object.prototype.hasOwnProperty.call(mapping, from)) {
        const element = mapping[from];
        probs_obj["letters"][from] = {}
        let sum = 0;

        for (const to in element) {
            if (Object.prototype.hasOwnProperty.call(element, to)) {
                const amt = element[to];
                sum += amt;
            }
        }

        for (const to in element) {
            if (Object.prototype.hasOwnProperty.call(element, to)) {
                const amt = element[to];
                probs_obj["letters"][from][to] = amt/sum
            }
        }

        sum = 0
        for (const to in element) {
            if (Object.prototype.hasOwnProperty.call(element, to)) {
                const amt = probs_obj["letters"][from][to];
                probs_obj["letters"][from][to] = sum + amt
                sum += amt
            }
        }
    }
}

// start/length prob gen
let inc = 1 / data_split.length;
for (const smash of data_split) {
    if (probs_obj["starts"][smash.at(0)] == undefined) {probs_obj["starts"][smash.at(0)] = inc}
    else {probs_obj["starts"][smash.at(0)] += inc}

    if (probs_obj["lengths"][smash.length] == undefined) {
        probs_obj["lengths"][smash.length] = inc
    }
    else {
        probs_obj["lengths"][smash.length] += inc
    }
}

let sum = 0
for (const entry in probs_obj.starts) {
    if (Object.prototype.hasOwnProperty.call(probs_obj.starts, entry)) {
        const amt = probs_obj.starts[entry];
        probs_obj.starts[entry] = amt + sum
        sum += amt
    }
}

sum = 0
for (const entry in probs_obj.lengths) {
    if (Object.prototype.hasOwnProperty.call(probs_obj.lengths, entry)) {
        const amt = probs_obj.lengths[entry];
        probs_obj.lengths[entry] = amt + sum
        sum += amt
    }
}

// console.log(probs_obj);

// obj => arrays

let probs = {
    "letters": {},
    "starts": [],
    "lengths": []
}

for (const length in probs_obj.lengths) {
    if (Object.prototype.hasOwnProperty.call(probs_obj.lengths, length)) {
        const amt = probs_obj.lengths[length];
        probs.lengths.push(
            {
                val: length,
                prob: amt
            }
        )
    }
}

for (const start in probs_obj.starts) {
    if (Object.prototype.hasOwnProperty.call(probs_obj.starts, start)) {
        const amt = probs_obj.starts[start];
        probs.starts.push(
            {
                val: start,
                prob: amt
            }
        )
    }
}

for (const startletter in probs_obj.letters) {
    if (Object.prototype.hasOwnProperty.call(probs_obj.letters, startletter)) {
        let temp = []

        for (const endletter in probs_obj.letters[startletter]) {
            if (Object.prototype.hasOwnProperty.call(probs_obj.letters[startletter], endletter)) {
                const amt = probs_obj.letters[startletter][endletter];
                temp.push(
                    {
                        val: endletter,
                        prob: amt
                    }
                )
            }
        }

        probs.letters[startletter] = temp
    }
}

function choose(array) {
    if (array == undefined) {
        console.error("THE ARRAY IS UNDEFINED!!")
        return undefined
    }
    let die = Math.random()
    let chosen = array.find((elem) => elem.prob >= die)
    return chosen.val
}

// ACTUAL GENERATION CODE NOW

function genfucker(length) {
    let smash = choose(probs.starts)
    let prev = smash

    for (let i = 1; i < length; i++) {
        prev = choose(probs.letters[prev])  
        if (prev == undefined) break 
        smash = smash + prev
    }
    return smash
}
console.log(genfucker(2000))
// let out = []
// for (let i = 0; i < 100; i++) {
//     let length = choose(probs.lengths)
    // let length = Math.floor(8 / Math.random() - 6)

//     console.log(`chosen length: ${length}`)

//     out.push(genfucker(length))
// }

// fs.writeFileSync("smashes.txt", out.join("\n"))
fs.writeFileSync("prob.json", JSON.stringify(probs))