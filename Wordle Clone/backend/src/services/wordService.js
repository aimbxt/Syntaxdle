const fs = require('fs')
const path = require('path')

const words = JSON.parse(fs.readFileSync(path.join(__dirname, '../words.json'), 'utf8'))
const wordData = words.words
const csWords = JSON.parse(fs.readFileSync(path.join(__dirname, '../cs_words.json'), 'utf8'));
const csWordData = csWords.concepts;
const wordsSet = new Set(wordData)


const getDailySolution = (isCS) => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayIndex = Math.floor(startOfDay.getTime() / 86400000)

    const pool = isCS ? csWordData : wordData;
    return pool[dayIndex % pool.length]; //wordData: word (String) csWordData: object (Word:, Definition:)
}

const checkWord = (word) => {
    return wordsSet.has(word)
}

module.exports = { getDailySolution, checkWord };