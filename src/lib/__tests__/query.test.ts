import * as subj from '../query'
import {
    makeAnswer,
    makeAnswerPath,
    makeBonus,
    makeBonusPath,
    makeCategoryPath,
    makeGame,
    makePlayerPath,
    makeQuestionPath,
    makeTeamPath
} from '../records'
import {List} from 'immutable'

describe('keyedTeams', () => {
    it('returns all teams in a game', () => {
        const teams = subj.keyedTeams(makeGame())
        expect(teams.size).toEqual(2)
        expect(teams.keySeq().toArray()).toEqual([
            makeTeamPath({team: 0}),
            makeTeamPath({team: 1}),
        ])
    })
})

describe('keyedPlayers', () => {
    it('returns all players in a game', () => {
        const players = subj.keyedPlayers(makeGame())
        expect(players.toList().size).toEqual(8)
        expect(players.keySeq().take(5).toArray()).toEqual([
            makePlayerPath({team: 0, player: 0}),
            makePlayerPath({team: 0, player: 1}),
            makePlayerPath({team: 0, player: 2}),
            makePlayerPath({team: 0, player: 3}),
            makePlayerPath({team: 1, player: 0}),
        ])
    })

    it('returns all players for a given team if filtered', () => {
        const players = subj.keyedPlayers(makeGame(), makeTeamPath({team: 1}))
        expect(players.toList().size).toEqual(4)
        expect(players.keySeq().toArray()).toEqual([
            makePlayerPath({team: 1, player: 0}),
            makePlayerPath({team: 1, player: 1}),
            makePlayerPath({team: 1, player: 2}),
            makePlayerPath({team: 1, player: 3})
        ])
    })
})

describe('keyedCategories', () => {
    it('returns all questions in a game', () => {
        const categories = subj.keyedCategories(makeGame())
        expect(categories.size).toEqual(5)
        expect(categories.keySeq().take(6).toArray()).toEqual([
            makeCategoryPath({category: 0}),
            makeCategoryPath({category: 1}),
            makeCategoryPath({category: 2}),
            makeCategoryPath({category: 3}),
            makeCategoryPath({category: 4})
        ])
    })
})

describe('keyedQuestions', () => {
    it('returns all questions in a game', () => {
        const questions = subj.keyedQuestions(makeGame())
        expect(questions.toList().size).toEqual(20)
        expect(questions.keySeq().take(6).toArray()).toEqual([
            makeQuestionPath({category: 0, question: 0}),
            makeQuestionPath({category: 0, question: 1}),
            makeQuestionPath({category: 0, question: 2}),
            makeQuestionPath({category: 0, question: 3}),
            makeQuestionPath({category: 1, question: 0}),
            makeQuestionPath({category: 1, question: 1})
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
        const questions = subj.keyedQuestions(makeGame(), makeCategoryPath({category: 1}))
        expect(questions.toList().size).toEqual(4)
        expect(questions.keySeq().toArray()).toEqual([
            makeQuestionPath({category: 1, question: 0}),
            makeQuestionPath({category: 1, question: 1}),
            makeQuestionPath({category: 1, question: 2}),
            makeQuestionPath({category: 1, question: 3})
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
            makeQuestionPath({category: 0, question: 3}),
            makeQuestionPath({category: 1, question: 2}),
            makeQuestionPath({category: 2, question: 1}),
            makeQuestionPath({category: 3, question: 0}),
            makeQuestionPath({category: 4, question: 3}),
            makeQuestionPath({category: 0, question: 2})
        ])
    })
})

describe('keyedBonuses', () => {
    it('returns empty list if no bonuses have been recorded', () => {
        const bonuses = subj.keyedBonuses(makeGame())
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns bonuses if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'bonuses'], [
            makeBonus({team: makeTeamPath({team: 0}), value: 10}),
            makeBonus({team: makeTeamPath({team: 1}), value: 15})
        ])

        const bonuses = subj.keyedBonuses(game)
        expect(bonuses.keySeq().toArray()).toEqual([
            makeBonusPath({category: 0, bonus: 0}),
            makeBonusPath({category: 0, bonus: 1})
        ])
        expect(bonuses.valueSeq().map((b) => b.value).toArray()).toEqual([10, 15])
    })
})

describe('bonusesForTeam', () => {
    it('returns empty list if no bonuses have been recorded', () => {
        const bonuses = subj.bonusesForTeam(makeGame(), makeTeamPath({team: 0}))
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns bonuses if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'bonuses'], [
            makeBonus({team: makeTeamPath({team: 0}), value: 10}),
            makeBonus({team: makeTeamPath({team: 1}), value: 15})
        ])

        const bonuses = subj.bonusesForTeam(game, makeTeamPath({team: 1}))
        expect(bonuses.keySeq().toArray()).toEqual([
            makeBonusPath({category: 0, bonus: 1})
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
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], [
            makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 1}), isCorrect: true})
        ])

        const answers = subj.keyedAnswers(game)
        expect(answers.keySeq().toArray()).toEqual([
            makeAnswerPath({category: 0, question: 0, answer: 0}),
            makeAnswerPath({category: 0, question: 0, answer: 1}),
            makeAnswerPath({category: 0, question: 0, answer: 2})
        ])
        expect(answers.valueSeq().map((a) => a.player.player).toArray()).toEqual([0, 0, 1])
    })
})

describe('answersForTeam', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.answersForTeam(makeGame(), makeTeamPath({team: 0}))
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], [
            makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
            makeAnswer({player: makePlayerPath({team: 1, player: 1}), isCorrect: true})
        ])

        const answers = subj.answersForTeam(game, makeTeamPath({team: 1}))
        expect(answers.keySeq().toArray()).toEqual([
            makeAnswerPath({category: 0, question: 0, answer: 1}),
            makeAnswerPath({category: 0, question: 0, answer: 2})
        ])
        expect(answers.valueSeq().map((a) => a.player.player).toArray()).toEqual([0, 1])
    })
})

describe('answersForPlayer', () => {
    it('returns empty list if no answers have been recorded', () => {
        const bonuses = subj.answersForPlayer(makeGame(), makePlayerPath({team: 0, player: 0}))
        expect(bonuses.toList().size).toEqual(0)
    })

    it('returns answers if any are recorded', () => {
        const game = makeGame()
            .setIn(['categories', 0, 'questions', 0, 'answers'], [
                makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false}),
                makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
                makeAnswer({player: makePlayerPath({team: 1, player: 1}), isCorrect: true})
            ])
            .setIn(['categories', 0, 'questions', 1, 'answers'], [
                makeAnswer({player: makePlayerPath({team: 1, player: 0}), isCorrect: false}),
                makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: true})
            ])

        const answers = subj.answersForPlayer(game, makePlayerPath({team: 0, player: 0}))
        expect(answers.keySeq().toArray()).toEqual([
            makeAnswerPath({category: 0, question: 0, answer: 0}),
            makeAnswerPath({category: 0, question: 1, answer: 1})
        ])
        expect(answers.valueSeq().map((a) => a.isCorrect).toArray()).toEqual([false, true])
    })
})

describe('answerByPath', () => {
    it('returns nothing if path references non-existent answer', () => {
        const path = makeAnswerPath({category: 0, question: 0, answer: 0})
        expect(subj.answerByPath(makeGame(), path)).toBeUndefined()
    })

    it('returns answer if possible', () => {
        const answer = makeAnswer({player: makePlayerPath({team: 0, player: 0}), isCorrect: false})
        const game = makeGame().setIn(['categories', 0, 'questions', 0, 'answers'], [answer])

        const path = makeAnswerPath({category: 0, question: 0, answer: 0})
        expect(subj.answerByPath(game, path)).toEqual(answer)
    })
})

describe('questionByPath', () => {
    it('returns question if possible', () => {
        const game = makeGame()
        const question = game.categories.get(0).questions.get(0)

        const path = makeQuestionPath({category: 0, question: 0})
        expect(subj.questionByPath(game, path)).toEqual(question)
    })

    it('returns question from AnswerPath if possible', () => {
        const game = makeGame()
        const question = game.categories.get(0).questions.get(0)

        const path = makeAnswerPath({category: 0, question: 0, answer: 0})
        expect(subj.questionByPath(game, path)).toEqual(question)
    })
})

describe('bonusByPath', () => {
    it('returns nothing if path references non-existent answer', () => {
        const path = makeBonusPath({category: 0, bonus: 0})
        expect(subj.bonusByPath(makeGame(), path)).toBeUndefined()
    })

    it('returns bonus if possible', () => {
        const bonus = makeBonus({team: makeTeamPath({team: 0}), value: 10})
        const game = makeGame().setIn(['categories', 0, 'bonuses'], [bonus])

        const path = makeBonusPath({category: 0, bonus: 0})
        expect(subj.bonusByPath(game, path)).toEqual(bonus)
    })
})

describe('categoryByPath', () => {
    it('returns category if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        const path = makeCategoryPath({category: 0})
        expect(subj.categoryByPath(game, path)).toEqual(category)
    })

    it('returns category from BonusPath if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        const path = makeBonusPath({category: 0, bonus: 0})
        expect(subj.categoryByPath(game, path)).toEqual(category)
    })

    it('returns category from QuestionPath if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        const path = makeQuestionPath({category: 0, question: 0})
        expect(subj.categoryByPath(game, path)).toEqual(category)
    })

    it('returns category from AnswerPath if possible', () => {
        const game = makeGame()
        const category = game.categories.get(0)

        const path = makeAnswerPath({category: 0, question: 0, answer: 0})
        expect(subj.categoryByPath(game, path)).toEqual(category)
    })
})

describe('teamByPath', () => {
    it('returns team if possible', () => {
        const game = makeGame()
        const team = game.teams.get(0)

        const path = makeTeamPath({team: 0})
        expect(subj.teamByPath(game, path)).toEqual(team)
    })

    it('returns team from PlayerPath if possible', () => {
        const game = makeGame()
        const team = game.teams.get(0)

        const path = makePlayerPath({team: 0, player: 0})
        expect(subj.teamByPath(game, path)).toEqual(team)
    })
})

describe('playerByPath', () => {
    it('returns player if possible', () => {
        const game = makeGame()
        const player = game.teams.get(0).players.get(0)

        const path = makePlayerPath({team: 0, player: 0})
        expect(subj.playerByPath(game, path)).toEqual(player)
    })
})


describe('categoryKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        const path = makeCategoryPath({category: 1})
        expect(subj.categoryKeyPath(path)).toEqual(List(['categories', 1]))
    })

    it('returns an appropriate KeyPath from a BonusPath', () => {
        const path = makeBonusPath({category: 1, bonus: 2})
        expect(subj.categoryKeyPath(path)).toEqual(List(['categories', 1]))
    })

    it('returns an appropriate KeyPath from a QuestionPath', () => {
        const path = makeQuestionPath({category: 1, question: 2})
        expect(subj.categoryKeyPath(path)).toEqual(List(['categories', 1]))
    })

    it('returns an appropriate KeyPath from an AnswerPath', () => {
        const path = makeAnswerPath({category: 1, question: 2, answer: 3})
        expect(subj.categoryKeyPath(path)).toEqual(List(['categories', 1]))
    })
})

describe('bonusKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        const path = makeBonusPath({category: 1, bonus: 2})
        expect(subj.bonusKeyPath(path)).toEqual(List(['categories', 1, 'bonuses', 2]))
    })
})

describe('questionKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        const path = makeQuestionPath({category: 1, question: 2})
        expect(subj.questionKeyPath(path)).toEqual(List(['categories', 1, 'questions', 2]))
    })

    it('returns an appropriate KeyPath from an AnswerPath', () => {
        const path = makeAnswerPath({category: 1, question: 2, answer: 3})
        expect(subj.questionKeyPath(path)).toEqual(List(['categories', 1, 'questions', 2]))
    })
})

describe('answerKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        const path = makeAnswerPath({category: 1, question: 2, answer: 3})
        expect(subj.answerKeyPath(path)).toEqual(List(['categories', 1, 'questions', 2, 'answers', 3]))
    })
})

describe('teamKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        const path = makeTeamPath({team: 1})
        expect(subj.teamKeyPath(path)).toEqual(List(['teams', 1]))
    })

    it('returns an appropriate KeyPath from a PlayerPath', () => {
        const path = makePlayerPath({team: 1, player: 2})
        expect(subj.teamKeyPath(path)).toEqual(List(['teams', 1]))
    })
})

describe('playerKeyPath', () => {
    it('returns an appropriate KeyPath', () => {
        const path = makePlayerPath({team: 1, player: 2})
        expect(subj.playerKeyPath(path)).toEqual(List(['teams', 1, 'players', 2]))
    })
})
