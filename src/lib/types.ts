export type TeamKey = [number]
export type PlayerKey = [...TeamKey, number]
export type CategoryKey = [number]
export type QuestionKey = [...CategoryKey, number]
export type AnswerKey = [...QuestionKey, number]
export type BonusKey = [...CategoryKey, number]

export type HasTeam = TeamKey | PlayerKey
export type HasCategory = CategoryKey | QuestionKey | AnswerKey | BonusKey
export type HasQuestion = QuestionKey | AnswerKey
export type Key = CategoryKey | QuestionKey | AnswerKey | BonusKey | TeamKey | PlayerKey

export type KeyedItem<K, T> = [K, T]
export type KeyedTeam = KeyedItem<TeamKey, Team>
export type KeyedPlayer = KeyedItem<PlayerKey, Player>
export type KeyedCategory = KeyedItem<CategoryKey, Category>
export type KeyedQuestion = KeyedItem<QuestionKey, Question>
export type KeyedAnswer = KeyedItem<AnswerKey, Answer>
export type KeyedBonus = KeyedItem<BonusKey, Bonus>


export type Player = {
    name: string
}
export const makePlayer = (params = {}) => ({name: 'Unknown Player', ...params} as Player)

export type Team = {
    name: string
    players: Player[]
}
export const makeTeam = (params = {}) => ({
    name: 'Unknown Team',
    players: [1, 2, 3, 4].map((idx) => makePlayer({name: `Player ${idx}`})),
    ...params
} as Team)

export type Answer = {
    playerKey: PlayerKey
    isCorrect: boolean
}
export const makeAnswer = (params = {}) => ({playerKey: null, isCorrect: null, ...params} as Answer)

export type Question = {
    number: number
    value: number
    answers: Answer[]
}
export const makeQuestion = (params = {}) => ({number: null, value: null, answers: [], ...params} as Question)

export type Bonus = {
    teamKey: TeamKey
    value: number
}
export const makeBonus = (params = {}) => ({teamKey: null, value: null, ...params} as Bonus)

export type Category = {
    name: string
    questions: Question[]
    bonuses: Bonus[]
}
export const makeCategory = (params = {}) => ({
    name: 'Unknown Category',
    questions: [10, 15, 15, 20].map((value) => makeQuestion({value})),
    bonuses: [],
    ...params
} as Category)

export type Game = {
    teams: Team[]
    categories: Category[]
    questionNumber: number
}
export const makeGame = (params = {}) => ({
    teams: [1, 2].map((idx) => makeTeam({name: `Team ${idx}`})),
    categories: [1, 2, 3, 4, 5].map((idx) => makeCategory({name: `Category ${idx}`})),
    questionNumber: 1,
    ...params
} as Game)

export const areKeysEqual = (a: Key, b: Key): boolean => {
    if (a === undefined || b === undefined) return false
    return a.slice(0, Math.min(a.length, b.length))
        .every((val, idx) => val === b[idx])
}

export const getKey = <T=any>(pair: KeyedItem<Key, T>): Key => pair[0]
export const getItem = <T=any>(pair: KeyedItem<Key, T>): T => pair[1]