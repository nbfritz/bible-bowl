import {makeAnswer, makeBonus, makeGame} from '../types'
import * as subj from '../rules'
import produce from 'immer'

describe('currentQuestionKey', () => {
    it('should return the key for the question matching the current question number', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[1].number = 1
        })

        expect(subj.currentQuestionKey(game)).toEqual([0, 1])
    })
})

describe('nameNeedsCategoryChoice', () => {
    it('should be true if no question matches the current question', () => {
        expect(subj.gameNeedsCategoryChoice(makeGame())).toEqual(true)
    })

    it('should be false if a question matches the current question', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].number = 1
        })

        expect(subj.gameNeedsCategoryChoice(game)).toEqual(false)
    })
})

describe('categoriesNeedingBonus', () => {
    it('should be empty with no ready categories', () => {
        expect(subj.categoriesNeedingBonus(makeGame()).length).toEqual(0)
    })

    it('should return a category needing bonus', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].number = 1
            draft.categories[0].questions[1].number = 2
            draft.categories[0].questions[2].number = 3
            draft.categories[0].questions[3].number = 4
        })
        expect(subj.categoriesNeedingBonus(game).length).toEqual(1)
    })

    it('should ignore completed bonuses', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].number = 1
            draft.categories[0].questions[1].number = 2
            draft.categories[0].questions[2].number = 3
            draft.categories[0].questions[3].number = 4

            draft.categories[0].bonuses = [
                makeBonus({teamKey: [0], value: 10}),
                makeBonus({teamKey: [1], value: 10})
            ]
        })

        expect(subj.categoriesNeedingBonus(game).length).toEqual(0)
    })
})

describe('scoreForTeam', () => {
    it('should return 0 with no answers', () => {
        const game = makeGame()

        expect(subj.scoreForTeam(game, [0])).toEqual(0)
        expect(subj.scoreForTeam(game, [1])).toEqual(0)
    })

    it('should return a score with only answers', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].answers = [
                makeAnswer({playerKey: [0, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 1], isCorrect: true})
            ]
        })

        expect(subj.scoreForTeam(game, [0])).toEqual(0)
        expect(subj.scoreForTeam(game, [1])).toEqual(10)
    })

    it('should return a score with answers and bonuses', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].answers = [
                makeAnswer({playerKey: [0, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 1], isCorrect: true})
            ]
            draft.categories[0].bonuses = [
                makeBonus({teamKey: [0], value: 10}),
                makeBonus({teamKey: [1], value: 15}),
            ]
        })

        expect(subj.scoreForTeam(game, [0])).toEqual(10)
        expect(subj.scoreForTeam(game, [1])).toEqual(25)
    })
})

describe('scoreForPlayer', () => {
    it('should return a score', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].answers = [
                makeAnswer({playerKey: [0, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 1], isCorrect: true})
            ]
            draft.categories[0].questions[1].answers = [
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [0, 0], isCorrect: true})
            ]
        })
        expect(subj.scoreForPlayer(game, [0, 0])).toEqual(15)
        expect(subj.scoreForPlayer(game, [1, 0])).toEqual(0)
        expect(subj.scoreForPlayer(game, [1, 1])).toEqual(10)
    })
})

