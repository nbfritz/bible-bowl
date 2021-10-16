import * as subj from '../query'
import {Answer, Bonus, getItem, getKey, makeAnswer, makeBonus, makeGame, Question} from '../types'
import produce from 'immer'

describe('keyedTeams', () => {
    it('returns all teams in a game', () => {
        const teams = subj.keyedTeams(makeGame())
        expect(teams.length).toEqual(2)
        expect(teams.map(getKey)).toEqual([[0], [1]])
    })
})

describe('keyedPlayers', () => {
    it('returns all players in a game', () => {
        const players = subj.keyedPlayers(makeGame())
        expect(players.length).toEqual(8)
        expect(players.map(getKey)).toEqual([
            [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3]
        ])
    })

    it('returns all players for a given team if filtered', () => {
        const players = subj.keyedPlayers(makeGame(), [1])
        expect(players.length).toEqual(4)
        expect(players.map(getKey)).toEqual([
            [1, 0], [1, 1], [1, 2], [1, 3]
        ])
    })
})

describe('keyedCategories', () => {
    it('returns all questions in a game', () => {
        const categories = subj.keyedCategories(makeGame())
        expect(categories.length).toEqual(5)
        expect(categories.map(getKey)).toEqual([[0], [1], [2], [3], [4]])
    })
})

describe('keyedQuestions', () => {
    it('returns all questions in a game', () => {
        const questions = subj.keyedQuestions(makeGame())
        expect(questions.length).toEqual(20)
        expect(questions.slice(0,6).map(getKey)).toEqual([
            [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1]
        ])
        expect(questions.map((q) => getItem<Question>(q).value)).toEqual([
            10, 15, 15, 20,
            10, 15, 15, 20,
            10, 15, 15, 20,
            10, 15, 15, 20,
            10, 15, 15, 20
        ])
    })

    it('returns questions for a category if filtered', () => {
        const questions = subj.keyedQuestions(makeGame(), [1])
        expect(questions.length).toEqual(4)
        expect(questions.map(getKey)).toEqual([
            [1, 0], [1, 1], [1, 2], [1, 3]
        ])
    })
})

describe('sortedQuestions', () => {
    it('returns all questions in a game, sorted by question number', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[3].number = 1
            draft.categories[1].questions[2].number = 2
            draft.categories[2].questions[1].number = 3
            draft.categories[3].questions[0].number = 4
            draft.categories[4].questions[3].number = 5
            draft.categories[0].questions[2].number = 6
        })

        const questions = subj.sortedQuestions(game)
        expect(questions.map(getKey)).toEqual([
            [0, 3], [1, 2], [2, 1], [3, 0], [4, 3], [0, 2]
        ])
    })
})

describe('keyedAnswers', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.keyedAnswers(makeGame())
        expect(bonuses.length).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].answers = [
                makeAnswer({playerKey: [0, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 1], isCorrect: true})
            ]
        })

        const answers = subj.keyedAnswers(game)
        expect(answers.map(getKey)).toEqual([[0, 0, 0], [0, 0, 1], [0, 0, 2]])
        expect(answers.map((a) => getItem<Answer>(a).playerKey)).toEqual([[0, 0], [1, 0], [1, 1]])
    })
})

describe('keyedBonuses', () => {
    it('returns empty list if no bonuses have been recorded', () => {
        const bonuses = subj.keyedBonuses(makeGame())
        expect(bonuses.length).toEqual(0)
    })

    it('returns bonuses if any are recorded', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].bonuses = [
                makeBonus({teamKey: [0], value: 10}),
                makeBonus({teamKey: [1], value: 15})
            ]
        })

        const bonuses = subj.keyedBonuses(game)
        expect(bonuses.map(getKey)).toEqual([[0, 0], [0, 1]])
        expect(bonuses.map((b) => getItem<Bonus>(b).value)).toEqual([10, 15])
    })
})

describe('bonusesForTeam', () => {
    it('returns empty list if no bonuses have been recorded', () => {
        const bonuses = subj.bonusesForTeam(makeGame(), [0])
        expect(bonuses.length).toEqual(0)
    })

    it('returns bonuses if any are recorded', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].bonuses = [
                makeBonus({teamKey: [0], value: 10}),
                makeBonus({teamKey: [1], value: 15})
            ]
        })

        const bonuses = subj.bonusesForTeam(game, [1])
        expect(bonuses.map(getKey)).toEqual([[0, 1]])
        expect(bonuses.map((b) => getItem<Bonus>(b).value)).toEqual([15])
    })
})

describe('answersForTeam', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.answersForTeam(makeGame(), [0])
        expect(bonuses.length).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].answers = [
                makeAnswer({playerKey: [0, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 1], isCorrect: true})
            ]
        })

        const answers = subj.answersForTeam(game, [1])
        expect(answers.map(getKey)).toEqual([[0, 0, 1], [0, 0, 2]])
        expect(answers.map((a) => getItem<Answer>(a).playerKey)).toEqual([[1, 0], [1, 1]])
    })
})

describe('answersForPlayer', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.answersForPlayer(makeGame(), [0, 0])
        expect(bonuses.length).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
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

        const answers = subj.answersForPlayer(game, [0, 0])
        expect(answers.map(getKey)).toEqual([[0, 0, 0], [0, 1, 1]])
        expect(answers.map((a) => getItem<Answer>(a).isCorrect)).toEqual([false, true])
    })
})

describe('answerByKey', () => {
    it('returns nothing if path references non-existent answer', () => {
        expect(subj.answerByKey(makeGame(), [0, 0, 0])).toBeUndefined()
    })

    it('returns answer if possible', () => {
        const answer = makeAnswer({playerKey: [0, 0], isCorrect: false})
        const game = produce(makeGame(), draft => {
            draft.categories[0].questions[0].answers = [answer]
        })

        expect(subj.answerByKey(game, [0, 0, 0])).toEqual(answer)
    })
})

describe('questionByKey', () => {
    it('returns question if possible', () => {
        const game = makeGame()
        const question = game.categories[0].questions[0]

        expect(subj.questionByKey(game, [0, 0])).toEqual(question)
    })

    it('returns question from AnswerPath if possible', () => {
        const game = makeGame()
        const question = game.categories[0].questions[0]

        expect(subj.questionByKey(game, [0, 0, 0])).toEqual(question)
    })
})

describe('bonusByKey', () => {
    it('returns nothing if path references non-existent answer', () => {
        expect(subj.bonusByKey(makeGame(), [0, 0])).toBeUndefined()
    })

    it('returns bonus if possible', () => {
        const bonus = makeBonus({teamKey: [0], value: 10})
        const game = produce(makeGame(), draft => {
            draft.categories[0].bonuses = [bonus]
        })

        expect(subj.bonusByKey(game, [0, 0])).toEqual(bonus)
    })
})

describe('categoryByKey', () => {
    it('returns category if possible', () => {
        const game = makeGame()
        const category = game.categories[0]

        expect(subj.categoryByKey(game, [0])).toEqual(category)
    })

    it('returns category from BonusPath if possible', () => {
        const game = makeGame()
        const category = game.categories[0]

        expect(subj.categoryByKey(game, [0, 0])).toEqual(category)
    })

    it('returns category from QuestionPath if possible', () => {
        const game = makeGame()
        const category = game.categories[0]

        expect(subj.categoryByKey(game, [0, 0])).toEqual(category)
    })

    it('returns category from AnswerPath if possible', () => {
        const game = makeGame()
        const category = game.categories[0]

        expect(subj.categoryByKey(game, [0, 0, 0])).toEqual(category)
    })
})

describe('teamByKey', () => {
    it('returns team if possible', () => {
        const game = makeGame()
        const team = game.teams[0]

        expect(subj.teamByKey(game, [0])).toEqual(team)
    })

    it('returns team from PlayerPath if possible', () => {
        const game = makeGame()
        const team = game.teams[0]

        expect(subj.teamByKey(game, [0, 0])).toEqual(team)
    })
})

describe('playerByKey', () => {
    it('returns player if possible', () => {
        const game = makeGame()
        const player = game.teams[0].players[0]

        expect(subj.playerByKey(game, [0, 0])).toEqual(player)
    })
})