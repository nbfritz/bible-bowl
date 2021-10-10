import { Game, Bonus, Answer, makeBonus, makeAnswer } from './records'
import type { PlayerPath, QuestionPath, CategoryPath, BonusPath, AnswerPath, TeamPath } from './records'
import { questionKeyPath, categoryKeyPath } from './query'
import type { List } from 'immutable'

export const scoreBonus = (
    game: Game,
    categoryPath: CategoryPath | BonusPath | QuestionPath | AnswerPath,
    team: TeamPath,
    value: number
): Game =>
    game.updateIn(
        categoryKeyPath(categoryPath).push('bonuses'),
        (b) => (b as List<Bonus>).push(makeBonus({ team, value }))
    )

export const scoreAnswer = (
    game: Game,
    questionPath: QuestionPath,
    player: PlayerPath,
    isCorrect: boolean
): Game =>
    game.updateIn(
        questionKeyPath(questionPath).push('answers'),
        (a) => (a as List<Answer>).push(makeAnswer({ player, isCorrect }))
    )

export const nextQuestion = (game: Game): Game =>
    game.setIn(["questionNumber"], game.questionNumber + 1)
