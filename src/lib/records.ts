import type {RecordOf} from 'immutable'
import {List, Record} from 'immutable'

export type KeyPath = List<string | number>

export type CategoryKey = [number]
export type QuestionKey = [number, number]
export type AnswerKey = [number, number, number]
export type BonusKey = [number, number]
export type PlayerKey = [number, number]
export type TeamKey = [number]
export type HasCategory = CategoryKey | QuestionKey | AnswerKey | BonusKey
export type HasQuestion = QuestionKey | AnswerKey
export type HasTeam = TeamKey | PlayerKey

type PlayerProps = { name: String }
export type Player = RecordOf<PlayerProps>
export const makePlayer: Record.Factory<PlayerProps> = Record({
    name: 'Unknown Player'
})

type TeamProps = { name: String, players: List<Player> }
export type Team = RecordOf<TeamProps>
export const makeTeam: Record.Factory<TeamProps> = Record({
    name: 'Unknown Team',
    players: List([
        makePlayer({name: 'Player 1'}),
        makePlayer({name: 'Player 2'}),
        makePlayer({name: 'Player 3'}),
        makePlayer({name: 'Player 4'}),
    ])
})

type AnswerProps = { playerKey: PlayerKey, isCorrect: boolean }
export type Answer = RecordOf<AnswerProps>
export const makeAnswer: Record.Factory<AnswerProps> = Record({
    playerKey: null,
    isCorrect: null
})

type QuestionProps = { number: number, value: number, answers: List<Answer> }
export type Question = RecordOf<QuestionProps>
export const makeQuestion: Record.Factory<QuestionProps> = Record({
    number: null,
    value: null,
    answers: List()
})

type BonusProps = { teamKey: TeamKey, value: number }
export type Bonus = RecordOf<BonusProps>
export const makeBonus: Record.Factory<BonusProps> = Record({
    teamKey: null,
    value: null
})

type CategoryProps = { name: string, questions: List<Question>, bonuses: List<Bonus> }
export type Category = RecordOf<CategoryProps>
export const makeCategory: Record.Factory<CategoryProps> = Record({
    name: 'Unknown Category',
    bonuses: List(),
    questions: List([10, 15, 15, 20].map((value) => makeQuestion({value}))),
})

type GameProps = { questionNumber: number, categories: List<Category>, teams: List<Team> }
export type Game = RecordOf<GameProps>
export const makeGame: Record.Factory<GameProps> = Record({
    questionNumber: 1,
    categories: List([
        makeCategory({name: 'Category 1'}),
        makeCategory({name: 'Category 2'}),
        makeCategory({name: 'Category 3'}),
        makeCategory({name: 'Category 4'}),
        makeCategory({name: 'Category 5'})
    ]),
    teams: List([
        makeTeam({name: 'Team 1'}),
        makeTeam({name: 'Team 2'})
    ])
})
