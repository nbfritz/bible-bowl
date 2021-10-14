import * as subj from '../query'
import {
    makeAnswer,
    makeBonus,
    makeGame,
} from '../records'
import {List} from 'immutable'

describe('keyedTeams', () => {
    it('returns all teams in a game', () => {
        const teams = subj.keyedTeams(makeGame())
        expect(teams.size).toEqual(2)
        expect(teams.keySeq().toArray()).toEqual([
            [0], [1]
        ])
    })
})

describe('keyedPlayers', () => {
    it('returns all players in a game', () => {
        const players = subj.keyedPlayers(makeGame())
        expect(players.toList().size).toEqual(8)
        expect(players.keySeq().take(5).toArray()).toEqual([
            [0, 0], [0, 1], [0, 2], [0, 3], [1, 0]
        ])
    })

    it('returns all players for a given team if filtered', () => {
        const players = subj.keyedPlayers(makeGame(), [1])
        expect(players.toList().size).toEqual(4)
        expect(players.keySeq().toArray()).toEqual([
            [1, 0], [1, 1], [1, 2], [1, 3]
        ])
    })
})

describe('keyedCategories', () => {
    it('returns all questions in a game', () => {
        const categories = subj.keyedCategories(makeGame())
        expect(categories.size).toEqual(5)
        expect(categories.keySeq().take(6).toArray()).toEqual([
            [0], [1], [2], [3], [4]
        ])
    })
})

describe('keyedQuestions', () => {
    it('returns all questions in a game', () => {
        const questions = subj.keyedQuestions(makeGame())
        expect(questions.toList().size).toEqual(20)
        expect(questions.keySeq().take(6).toArray()).toEqual([
            [0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1]
        ])
        expect(questions.valueSeq().map((q) => q.value).toArray()).toEqual([
            10, 15, 15, 20,
            10, 15, 15, 20,
            10, 15, 15, 20,
            10, 15, 15, 20,
            10, 15, 15, 20
        ])
    })

    it('returns questions for a category if filtered', () => {
        const questions = subj.keyedQuestions(makeGame(), [1])
        expect(questions.toList().size).toEqual(4)
        expect(questions.keySeq().toArray()).toEqual([
            [1, 0], [1, 1], [1, 2], [1, 3]
        ])
    })
})

describe('sortedQuestions', () => {
    it('returns all questions in a game, sorted by question number', () => {
        const game = makeGame()
            .setIn(['categories', 0, 'questions', 3, 'number'], 1)
            .setIn(['categories', 1, 'questions', 2, 'number'], 2)
            .setIn(['categories', 2, 'questions', 1, 'number'], 3)
            .setIn(['categories', 3, 'questions', 0, 'number'], 4)
            .setIn(['categories', 4, 'questions', 3, 'number'], 5)
            .setIn(['categories', 0, 'questions', 2, 'number'], 6)

        const questions = subj.sortedQuestions(game)
        expect(questions.keySeq().toArray()).toEqual([
            [0, 3], [1, 2], [2, 1], [3, 0], [4, 3], [0, 2]
        ])
    })
})

describe('keyedBonuses', () => {
    it('returns empty list if no bonuses have been recorded', () => {
        const bonuses = subj.keyedBonuses(makeGame())
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns bonuses if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'bonuses'], List([
            makeBonus({teamKey: [0], value: 10}),
            makeBonus({teamKey: [1], value: 15})
        ]))

        const bonuses = subj.keyedBonuses(game)
        expect(bonuses.keySeq().toArray()).toEqual([
            [0, 0], [0, 1]
        ])
        expect(bonuses.valueSeq().map((b) => b.value).toArray()).toEqual([10, 15])
    })
})

describe('bonusesForTeam', () => {
    it('returns empty list if no bonuses have been recorded', () => {
        const bonuses = subj.bonusesForTeam(makeGame(), [0])
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns bonuses if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'bonuses'], List([
            makeBonus({teamKey: [0], value: 10}),
            makeBonus({teamKey: [1], value: 15})
        ]))

        const bonuses = subj.bonusesForTeam(game, [1])
        expect(bonuses.keySeq().toArray()).toEqual([
            [0, 1]
        ])
        expect(bonuses.valueSeq().map((b) => b.value).toArray()).toEqual([15])
    })
})

describe('keyedAnswers', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.keyedAnswers(makeGame())
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], List([
            makeAnswer({playerKey: [0, 0], isCorrect: false}),
            makeAnswer({playerKey: [1, 0], isCorrect: false}),
            makeAnswer({playerKey: [1, 1], isCorrect: true})
        ]))

        const answers = subj.keyedAnswers(game)
        expect(answers.keySeq().toArray()).toEqual([
            [0, 0, 0], [0, 0, 1], [0, 0, 2]
        ])
        expect(answers.valueSeq().map((a) => a.playerKey).toArray()).toEqual([[0, 0], [1, 0], [1, 1]])
    })
})

describe('answersForTeam', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.answersForTeam(makeGame(), [0])
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], List([
            makeAnswer({playerKey: [0, 0], isCorrect: false}),
            makeAnswer({playerKey: [1, 0], isCorrect: false}),
            makeAnswer({playerKey: [1, 1], isCorrect: true})
        ]))

        const answers = subj.answersForTeam(game, [1])
        expect(answers.keySeq().toArray()).toEqual([
            [0, 0, 1], [0, 0, 2]
        ])
        expect(answers.valueSeq().map((a) => a.playerKey).toArray()).toEqual([[1, 0], [1, 1]])
    })
})

describe('answersForPlayer', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.answersForPlayer(makeGame(), [0, 0])
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = makeGame()
            .setIn(['categories', 0, 'questions', 0, 'answers'], List([
                makeAnswer({playerKey: [0, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [1, 1], isCorrect: true})
            ]))
            .setIn(['categories', 0, 'questions', 1, 'answers'], List([
                makeAnswer({playerKey: [1, 0], isCorrect: false}),
                makeAnswer({playerKey: [0, 0], isCorrect: true})
            ]))

        const answers = subj.answersForPlayer(game, [0, 0])
        expect(answers.keySeq().toArray()).toEqual([
            [0, 0, 0], [0, 1, 1]
        ])
        expect(answers.valueSeq().map((a) => a.isCorrect).toArray()).toEqual([false, true])
    })
})

describe('answerByKey', () => {
    it('returns nothing if path references non-existent answer', () => {
        expect(subj.answerByKey(makeGame(), [0, 0, 0])).toBeUndefined()
    })

    it('returns answer if possible', () => {
        const answer = makeAnswer({playerKey: [0, 0], isCorrect: false})
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], [answer])

        expect(subj.answerByKey(game, [0, 0, 0])).toEqual(answer)
    })
})

describe('questionByKey', () => {
    it('returns question if possible', () => {
        const game = makeGame()
        const question = game.categories.get(0).questions.get(0)

        expect(subj.questionByKey(game, [0, 0])).toEqual(question)
    })

    it('returns question from AnswerPath if possible', () => {
        const game = makeGame()
        const question = game.categories.get(0).questions.get(0)

        expect(subj.questionByKey(game, [0, 0, 0])).toEqual(question)
    })
})

describe('bonusByKey', () => {
    it('returns nothing if path references non-existent answer', () => {
        expect(subj.bonusByKey(makeGame(), [0, 0])).toBeUndefined()
    })

    it('returns bonus if possible', () => {
        const bonus = makeBonus({teamKey: [0], value: 10})
        const game = makeGame().setIn(['categories', 0, 'bonuses'], [bonus])

        expect(subj.bonusByKey(game, [0, 0])).toEqual(bonus)
    })
})

describe('categoryByKey', () => {
    it('returns category if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        expect(subj.categoryByKey(game, [0])).toEqual(category)
    })

    it('returns category from BonusPath if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        expect(subj.categoryByKey(game, [0, 0])).toEqual(category)
    })

    it('returns category from QuestionPath if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        expect(subj.categoryByKey(game, [0, 0])).toEqual(category)
    })

    it('returns category from AnswerPath if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        expect(subj.categoryByKey(game, [0, 0, 0])).toEqual(category)
    })
})

describe('teamByKey', () => {
    it('returns team if possible', () => {
        const game = makeGame()
        const team = game.teams.get(0)

        expect(subj.teamByKey(game, [0])).toEqual(team)
    })

    it('returns team from PlayerPath if possible', () => {
        const game = makeGame()
        const team = game.teams.get(0)

        expect(subj.teamByKey(game, [0, 0])).toEqual(team)
    })
})

describe('playerByKey', () => {
    it('returns player if possible', () => {
        const game = makeGame()
        const player = game.teams.get(0).players.get(0)

        expect(subj.playerByKey(game, [0, 0])).toEqual(player)
    })
})


describe('categoryKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        expect(subj.categoryKeyToPath([1])).toEqual(List(['categories', 1]))
    })

    it('returns an appropriate KeyPath from a BonusKey', () => {
        expect(subj.categoryKeyToPath([1, 2])).toEqual(List(['categories', 1]))
    })

    it('returns an appropriate KeyPath from a QuestionKey', () => {
        expect(subj.categoryKeyToPath([1, 2])).toEqual(List(['categories', 1]))
    })

    it('returns an appropriate KeyPath from an AnswerKey', () => {
        expect(subj.categoryKeyToPath([1, 2, 3])).toEqual(List(['categories', 1]))
    })
})

describe('bonusKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        expect(subj.bonusKeyToPath([1, 2])).toEqual(List(['categories', 1, 'bonuses', 2]))
    })
})

describe('questionKeyToPath', () => {
    it('returns an appropriate KeyPath', () => {
        expect(subj.questionKeyToPath([1, 2])).toEqual(List(['categories', 1, 'questions', 2]))
    })

    it('returns an appropriate KeyPath from an AnswerKey', () => {
        expect(subj.questionKeyToPath([1, 2, 3])).toEqual(List(['categories', 1, 'questions', 2]))
    })
})

describe('answerKeyToPath', () => {
    it('returns an appropriate KeyPath', () => {
        expect(subj.answerKeyToPath([1, 2, 3])).toEqual(List(['categories', 1, 'questions', 2, 'answers', 3]))
    })
})

describe('teamKeyToPath', () => {
    it('returns an appropriate KeyPath', () => {
        expect(subj.teamKeyToPath([1])).toEqual(List(['teams', 1]))
    })

    it('returns an appropriate KeyPath from a PlayerKey', () => {
        expect(subj.teamKeyToPath([1, 2])).toEqual(List(['teams', 1]))
    })
})

describe('playerKeyToPath', () => {
    it('returns an appropriate KeyPath', () => {
        expect(subj.playerKeyToPath([1, 2])).toEqual(List(['teams', 1, 'players', 2]))
    })
})
