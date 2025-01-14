import probs from "./prob.js";

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

function generatesmash() {
    let len = Number(document.getElementById("amt").value)
    let output = document.getElementById("output")

    output.value = genfucker(len)
}

document.getElementById("generate").onclick = generatesmash