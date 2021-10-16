import type {HasCategory, HasQuestion, PlayerKey, QuestionKey, TeamKey} from './types'
import {Game, makeAnswer, makeBonus} from './types'
import produce from 'immer'

export const scoreBonus = (game: Game, categoryKey: HasCategory, teamKey: TeamKey, value: number): Game =>
    produce(game, draft => {
        draft.categories[categoryKey[0]].bonuses.push(
            makeBonus({teamKey, value})
        )
    })

export const scoreAnswer = (game: Game, questionKey: HasQuestion, playerKey: PlayerKey, isCorrect: boolean): Game =>
    produce(game, draft => {
        draft.categories[questionKey[0]].questions[questionKey[1]].answers.push(
            makeAnswer({playerKey, isCorrect})
        )
    })

export const nextQuestion = (game: Game): Game =>
    produce(game, draft => { draft.questionNumber += 1 })

export const selectQuestion = (game: Game, questionKey: QuestionKey): Game =>
    produce(game, draft => {
        draft.categories[questionKey[0]].questions[questionKey[1]].number = game.questionNumber
    })
