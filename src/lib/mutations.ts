import type {HasCategory, HasQuestion, PlayerKey, QuestionKey, TeamKey} from './records'
import {Answer, Bonus, Game, makeAnswer, makeBonus} from './records'
import {categoryKeyToPath, questionKeyToPath} from './query'
import type {List} from 'immutable'

export const scoreBonus = (
    game: Game,
    categoryKey: HasCategory,
    teamKey: TeamKey,
    value: number
): Game =>
    game.updateIn(
        categoryKeyToPath(categoryKey).push('bonuses'),
        (b) => (b as List<Bonus>).push(makeBonus({teamKey, value}))
    )

export const scoreAnswer = (
    game: Game,
    questionKey: HasQuestion,
    playerKey: PlayerKey,
    isCorrect: boolean
): Game =>
    game.updateIn(
        questionKeyToPath(questionKey).push('answers'),
        (a) => (a as List<Answer>).push(makeAnswer({playerKey, isCorrect}))
    )

export const nextQuestion = (game: Game): Game =>
    game.setIn(["questionNumber"], game.questionNumber + 1)

export const selectQuestion = (game: Game, questionKey: QuestionKey): Game => {
    return game.setIn(questionKeyToPath(questionKey).push('number'), game.questionNumber);
}
