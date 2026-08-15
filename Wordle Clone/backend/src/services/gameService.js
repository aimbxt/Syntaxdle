const wordService = require('./wordService');

const getDefinition = () => {
  return wordService.getDailySolution(true).definition;
}

const checkGuess = async (guess, isCS) => {
    const guessToString = guess.join('').toLowerCase()

    if (!wordService.checkWord(guessToString)) {
        const error = new Error('Not a valid word');
        error.statusCode = 400;
        throw error;
    }
    
    const solutionEntry = wordService.getDailySolution(isCS);
    const solution = isCS ? solutionEntry.word.toLowerCase().split('') : solutionEntry.toLowerCase().split('');
    const letterArray = guess.map((letter) => ({ letter, color: 'gray' }))

    // letter count registry
    const wordMap = new Map()
    for (let i = 0; i < 5; i++) {
      let letter = solution[i]
      if (!wordMap.has(letter)) {
        wordMap.set(letter, 1)
      }
      else {
        wordMap.set(letter, wordMap.get(letter) + 1)
      }
      console.log(wordMap)
    }
    //first loop to check for greens
    for (let i = 0; i < 5; i++) {
      let letter = letterArray[i].letter
      console.log(`Letter: ${letter} solution letter: ${solution[i]}`)
      if (letter === solution[i] && wordMap.get(letter) > 0) {
        wordMap.set(letter, wordMap.get(letter) - 1)
        letterArray[i] = {letter, color: "green"}
      }
    }
    //second loop to check for yellows
    for (let i = 0; i < 5; i++) {
      let letter = letterArray[i].letter
      if (letterArray[i].color === "green") {
        continue;
      }
      else if (solution.includes(letter) && wordMap.get(letter) > 0) {
        wordMap.set(letter, wordMap.get(letter) - 1)
        letterArray[i] = {letter, color: "yellow"}
      }
    }
    
    const isWin = letterArray.every((object, i) => (object.letter === solution[i]))
    
    return { letterArray, isWin };
}

module.exports = {checkGuess, getDefinition};