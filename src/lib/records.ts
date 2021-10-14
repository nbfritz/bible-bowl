import type {RecordOf} from 'immutable'
import {List, Record} from 'immutable'

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

type AnswerProps = { player: PlayerPath, isCorrect: boolean }
export type Answer = RecordOf<AnswerProps>
export const makeAnswer: Record.Factory<AnswerProps> = Record({
    player: null,
    isCorrect: null
})

type QuestionProps = { number: number, value: number, answers: List<Answer> }
export type Question = RecordOf<QuestionProps>
export const makeQuestion: Record.Factory<QuestionProps> = Record({
    number: null,
    value: null,
    answers: List()
})

type BonusProps = { team: TeamPath, value: number }
export type Bonus = RecordOf<BonusProps>
export const makeBonus: Record.Factory<BonusProps> = Record({
    team: null,
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
        makeCategory({name: 'Category 5'}),
    ]),
    teams: List([
        makeTeam({name: 'Team 1'}),
        makeTeam({name: 'Team 2'}),
    ])
})

type CategoryPathProps = { category: number }
export type CategoryPath = RecordOf<CategoryPathProps>
export const makeCategoryPath: Record.Factory<CategoryPathProps> = Record({
    category: null
})

type BonusPathProps = { category: number, bonus: number }
export type BonusPath = RecordOf<BonusPathProps>
export const makeBonusPath: Record.Factory<BonusPathProps> = Record({
    category: null,
    bonus: null
})

type QuestionPathProps = { category: number, question: number }
export type QuestionPath = RecordOf<QuestionPathProps>
export const makeQuestionPath: Record.Factory<QuestionPathProps> = Record({
    category: null,
    question: null
})

type AnswerPathProps = { category: number, question: number, answer: number }
export type AnswerPath = RecordOf<AnswerPathProps>
export const makeAnswerPath: Record.Factory<AnswerPathProps> = Record({
    category: null,
    question: null,
    answer: null
})

type TeamPathProps = { team: number }
export type TeamPath = RecordOf<TeamPathProps>
export const makeTeamPath: Record.Factory<TeamPathProps> = Record({
    team: null
})

type PlayerPathProps = { team: number, player: number }
export type PlayerPath = RecordOf<PlayerPathProps>
export const makePlayerPath: Record.Factory<PlayerPathProps> = Record({
    team: null,
    player: null
})

