import {answersForPlayer, answersForTeam, bonusesForTeam, keyedCategories, keyedQuestions, questionByKey} from './query'
import type {Game, KeyedAnswer, KeyedCategory, KeyedQuestion, PlayerKey, Question, QuestionKey, TeamKey} from './types'

export const currentQuestionKey = (game: Game): QuestionKey =>
    keyedQuestions(game).filter(([_key, question]: KeyedQuestion) => question.number === game.questionNumber)[0]?.[0]

export const gameNeedsCategoryChoice = (game: Game): boolean =>
    currentQuestionKey(game) === undefined

export const categoriesNeedingBonus = (game: Game): Array<KeyedCategory> =>
    keyedCategories(game)
        .filter(([_cKey, category]: KeyedCategory) => category.bonuses.length !== 2)
        .filter(([_cKey, category]: KeyedCategory) =>
            category.questions.filter((q: Question) => q.number === null).length === 0
        )

export const scoreForTeam = (game: Game, teamKey: TeamKey): number =>
    answersForTeam(game, teamKey)
        .filter(([_key, answer])  => answer.isCorrect)
        .map(([key, _answer]) => questionByKey(game, key))
        .reduce((acc: number, question: Question) => acc + question.value, 0)
    + bonusesForTeam(game, teamKey)
        .reduce((acc: number, [_key, bonus]) => acc + bonus.value, 0)

export const scoreForPlayer = (game: Game, playerKey: PlayerKey): number =>
    answersForPlayer(game, playerKey)
        .filter(([aKey, answer]: KeyedAnswer) => answer.isCorrect)
        .map(([aKey, answer]: KeyedAnswer) => questionByKey(game, aKey))
        .reduce((acc: number, question: Question) => acc + question.value, 0)
