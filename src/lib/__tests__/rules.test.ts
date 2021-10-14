import {makeAnswer, makeBonus, makeGame, makePlayerPath, makeQuestionPath, makeTeamPath} from '../records'
import * as subj from '../rules'
import {List} from 'immutable'

describe('scoreForTeam', () => {
    it('should return 0 with no answers', () => {
        const game = makeGame()

        expect(subj.scoreForTeam(game, makeTeamPath({team: 0}))).toEqual(0)
        expect(subj.scoreForTeam(game, makeTeamPath({team: 1}))).toEqual(0)
    })

    it('should return a score with only answers', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], List([
            makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 1}), isCorrect: true})
        ]))

        expect(subj.scoreForTeam(game, makeTeamPath({team: 0}))).toEqual(0)
        expect(subj.scoreForTeam(game, makeTeamPath({team: 1}))).toEqual(10)
    })

    it('should return a score with answers and bonuses', () => {
        const game = makeGame()
            .setIn(['categories', 0, 'questions', 0, 'answers'], List([
                makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false}),
                makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
                makeAnswer({player: makePlayerPath({team: 1, player: 1}), isCorrect: true})
            ]))
            .setIn(['categories', 0, 'bonuses'], List([
                makeBonus({team: makeTeamPath({team: 0}), value: 10}),
                makeBonus({team: makeTeamPath({team: 1}), value: 15}),
            ]))

        expect(subj.scoreForTeam(game, makeTeamPath({team: 0}))).toEqual(10)
        expect(subj.scoreForTeam(game, makeTeamPath({team: 1}))).toEqual(25)
    })
})

describe('scoreForPlayer', () => {
    it('should return a score', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], List([
            makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 1}), isCorrect: true})
        ]))
            .setIn(['categories', 0, 'questions', 1, 'answers'], List([
                makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
                makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: true})
            ]))

        expect(subj.scoreForPlayer(game, makePlayerPath({team: 0, player: 0}))).toEqual(15)
        expect(subj.scoreForPlayer(game, makePlayerPath({team: 1, player: 0}))).toEqual(0)
        expect(subj.scoreForPlayer(game, makePlayerPath({team: 1, player: 1}))).toEqual(10)
    })
})

describe('categoriesNeedingBonus', () => {
    it('should be empty with no ready categories', () => {
        expect(subj.categoriesNeedingBonus(makeGame()).toList().size).toEqual(0)
    })

    it('should return a category needing bonus', () => {
        const game = makeGame()
            .setIn(["categories", 0, "questions", 0, "number"], 1)
            .setIn(["categories", 0, "questions", 1, "number"], 2)
            .setIn(["categories", 0, "questions", 2, "number"], 3)
            .setIn(["categories", 0, "questions", 3, "number"], 4)

        expect(subj.categoriesNeedingBonus(game).toList().size).toEqual(1)
    })

    it('should ignore completed bonuses', () => {
        const game = makeGame()
            .setIn(["categories", 0, "questions", 0, "number"], 1)
            .setIn(["categories", 0, "questions", 1, "number"], 2)
            .setIn(["categories", 0, "questions", 2, "number"], 3)
            .setIn(["categories", 0, "questions", 3, "number"], 4)
            .setIn(["categories", 0, "bonuses"], List([
                makeBonus({team: makeTeamPath({team: 0}), value: 10}),
                makeBonus({team: makeTeamPath({team: 1}), value: 10})
            ]))

        expect(subj.categoriesNeedingBonus(game).toList().size).toEqual(0)
    })
})

describe('nameNeedsCategoryChoice', () => {
    it('should be true if no question matches the current question', () => {
        expect(subj.gameNeedsCategoryChoice(makeGame())).toEqual(true)
    })

    it('should be false if a question matches the current question', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'number'], 1)
        expect(subj.gameNeedsCategoryChoice(game)).toEqual(false)
    })
})

describe('pathToCurrentQuestion', () => {
    it('should return the question matching the current question number', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 1, 'number'], 1)
        expect(subj.pathToCurrentQuestion(game)).toEqual(makeQuestionPath({category: 0, question: 1}))
    })
})
