import {answersForPlayer, answersForTeam, bonusesForTeam, keyedCategories, keyedQuestions, questionByKey} from './query'
import type {
    Answer,
    AnswerKey,
    Bonus,
    Category,
    CategoryKey,
    Game,
    PlayerKey,
    Question,
    QuestionKey,
    TeamKey
} from './records'
import type {Seq} from 'immutable'

export const scoreForTeam = (game: Game, teamKey: TeamKey): number =>
    answersForTeam(game, teamKey)
        .filter((answer: Answer)  => answer.isCorrect)
        .map((_: Answer, key: AnswerKey) => questionByKey(game, key))
        .reduce((acc: number, question: Question) => acc + question.value, 0)
    + bonusesForTeam(game, teamKey)
        .reduce((acc: number, bonus: Bonus) => acc + bonus.value, 0)

export const scoreForPlayer = (game: Game, playerKey: PlayerKey): number =>
    answersForPlayer(game, playerKey)
        .filter((answer: Answer) => answer.isCorrect)
        .map((_: Answer, key: AnswerKey) => questionByKey(game, key))
        .reduce((acc: number, question: Question) => acc + question.value, 0)

export const categoriesNeedingBonus = (game: Game): Seq.Keyed<CategoryKey, Category> =>
    keyedCategories(game)
        .filter((category: Category) => category.bonuses.size !== 2)
        .filter((category: Category) =>
            category.questions.filter((q: Question) => q.number === null).isEmpty()
        )

export const currentQuestionKey = (game: Game): QuestionKey =>
    keyedQuestions(game)
        .filter((q: Question) => q.number === game.questionNumber)
        .keySeq()
        .first()

export const gameNeedsCategoryChoice = (game: Game): boolean =>
    currentQuestionKey(game) === undefined
