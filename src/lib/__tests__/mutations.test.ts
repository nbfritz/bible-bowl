import * as subj from '../mutations'
import {makeCategoryPath, makeGame, makePlayerPath, makeQuestionPath, makeTeamPath} from '../records'

describe('score bonus', () => {
    it('adds a new bonus entry for a category', () => {
        const game = makeGame()
        const categoryPath = makeCategoryPath({category: 0})
        const team = makeTeamPath({team: 1})
        const newGame = subj.scoreBonus(game, categoryPath, team, 20)

        const bonus = newGame.categories.get(0).bonuses.get(0)
        expect(bonus.team).toEqual(team)
        expect(bonus.value).toEqual(20)
    })

    it('adds a new bonus entry for a category, given a question keypath', () => {
        const game = makeGame()
        const questionPath = makeQuestionPath({category: 0, question: 1})
        const team = makeTeamPath({team: 1})
        const newGame = subj.scoreBonus(game, questionPath, team, 20)

        const bonus = newGame.categories.get(0).bonuses.get(0)
        expect(bonus.team).toEqual(team)
        expect(bonus.value).toEqual(20)
    })
})

describe('score answer', () => {
    it('adds a new answer entry for a question', () => {
        const game = makeGame()
        const player = makePlayerPath({team: 1, player: 2})
        const questionPath = makeQuestionPath({category: 0, question: 0})
        const newGame = subj.scoreAnswer(game, questionPath, player, true)

        const answer = newGame.categories.get(0).questions.get(0).answers.get(0)
        expect(answer.player).toEqual(makePlayerPath({team: 1, player: 2}))
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
        const newGame = subj.selectQuestion(game, makeQuestionPath({category: 0, question: 1}))

        expect(game.categories.get(0).questions.get(1).number).toBeNull()
        expect(newGame.categories.get(0).questions.get(1).number).toEqual(1)
    })
})
