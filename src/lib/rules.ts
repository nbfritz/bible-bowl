import {
    answersForPlayer,
    answersForTeam,
    bonusesForTeam,
    keyedCategories,
    keyedQuestions,
    questionByPath
} from './query'
import type {Category, CategoryPath, Game, PlayerPath, QuestionPath, TeamPath} from './records'
import type {Seq} from 'immutable'

export const scoreForTeam = (game: Game, team: TeamPath): number =>
    answersForTeam(game, team)
        .filter((answer) => answer.isCorrect)
        .map((_, path) => questionByPath(game, path))
        .reduce((acc, question) => acc + question.value, 0)
    + bonusesForTeam(game, team)
        .reduce((acc, bonus) => acc + bonus.value, 0)

export const scoreForPlayer = (game: Game, player: PlayerPath): number =>
    answersForPlayer(game, player)
        .filter((answer) => answer.isCorrect)
        .map((_, path) => questionByPath(game, path))
        .reduce((acc, question) => acc + question.value, 0)

export const categoriesNeedingBonus = (game: Game): Seq.Keyed<CategoryPath, Category> =>
    keyedCategories(game)
        .filter((c) => c.bonuses.size !== 2)
        .filter((c) =>
            c.questions.filter((q) => q.number === null).isEmpty()
        )

export const pathToCurrentQuestion = (game: Game): QuestionPath =>
    keyedQuestions(game)
        .filter((q) => q.number === game.questionNumber)
        .keySeq()
        .first()

export const gameNeedsCategoryChoice = (game: Game): boolean =>
    pathToCurrentQuestion(game) === undefined
