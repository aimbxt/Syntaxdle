const fs = require('fs')
const path = require('path')

const words = JSON.parse(fs.readFileSync(path.join(__dirname, '../words.json'), 'utf8'))
const wordData = words.words
const wordsSet = new Set(wordData)


const getDailySolution = () => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayIndex = Math.floor(startOfDay.getTime() / 86400000)
    return wordData[dayIndex % wordData.length]
}

const checkWord = (word) => {
    return wordsSet.has(word)
}

module.exports = { getDailySolution, checkWord };