import * as subj from '../mutations'
import {makeGame} from '../types'

describe('score bonus', () => {
    it('adds a new bonus entry for a category', () => {
        const game = makeGame()
        const newGame = subj.scoreBonus(game, [0], [1], 20)

        const bonus = newGame.categories[0].bonuses[0]
        expect(bonus.teamKey).toEqual([1])
        expect(bonus.value).toEqual(20)
    })

    it('adds a new bonus entry for a category, given a question keypath', () => {
        const game = makeGame()
        const newGame = subj.scoreBonus(game, [0], [0], 20)

        const bonus = newGame.categories[0].bonuses[0]
        expect(bonus.teamKey).toEqual([0])
        expect(bonus.value).toEqual(20)
    })
})

describe('score answer', () => {
    it('adds a new answer entry for a question', () => {
        const game = makeGame()
        const newGame = subj.scoreAnswer(game, [0, 0], [1, 2], true)

        const answer = newGame.categories[0].questions[0].answers[0]
        expect(answer.playerKey).toEqual([1, 2])
        expect(answer.isCorrect).toEqual(true)
    })
})

describe('nextQuestion', () => {
    it('should increment the current question number', () => {
        const game = makeGame()
        const newGame = subj.nextQuestion(game)
        expect(game.questionNumber).toEqual(1)
        expect(newGame.questionNumber).toEqual(2)
    })
})


describe('selectQuestion', () => {
    it('should set the specified question to the current question number', () => {
        const game = makeGame()
        const newGame = subj.selectQuestion(game, [0, 1])

        expect(game.categories[0].questions[1].number).toBeNull()
        expect(newGame.categories[0].questions[1].number).toEqual(1)
    })
})