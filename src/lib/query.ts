import type {
    Answer,
    AnswerKey,
    Bonus,
    BonusKey,
    Category,
    CategoryKey,
    Game,
    HasCategory,
    HasQuestion,
    HasTeam,
    KeyedAnswer,
    KeyedBonus,
    KeyedCategory,
    KeyedPlayer,
    KeyedQuestion,
    KeyedTeam,
    Player,
    PlayerKey,
    Question,
    QuestionKey,
    Team,
    TeamKey
} from './types'
import * as _ from 'lodash'
import {areKeysEqual} from "./types";

export const keyedTeams = (game: Game): KeyedTeam[] =>
    game.teams.map((team, teamIndex) => [[teamIndex], team])

export const keyedPlayers = (game: Game, teamKey?: TeamKey): KeyedPlayer[] => (
    _.flatten(
        keyedTeams(game)
            .filter(([tKey, _team]: KeyedTeam) => !teamKey || areKeysEqual(tKey, teamKey))
            .map(([tKey, team]: KeyedTeam) =>
                team.players.map((player: Player, pIdx: number) => [[...tKey, pIdx] as PlayerKey, player])
            )
    )
)

export const keyedCategories = (game: Game): KeyedCategory[] =>
    game.categories.map((category: Category, cIdx: number) => [[cIdx] as CategoryKey, category])

export const keyedQuestions = (game: Game, categoryKey?: CategoryKey): KeyedQuestion[] =>
    _.flatten(
        keyedCategories(game)
            .filter(([cKey, _category]: KeyedCategory) => !categoryKey || areKeysEqual(cKey, categoryKey))
            .map(([cKey, category]: KeyedCategory) =>
                category.questions.map((question: Question, qIdx: number) => [[...cKey, qIdx] as QuestionKey, question])
            )
    )
export const sortedQuestions = (game: Game): KeyedQuestion[] =>
    keyedQuestions(game)
        .filter(([_qKey, question]: KeyedQuestion) => Boolean(question.number))
        .sort(([_qKey, question]: KeyedQuestion, [_qkey2, question2]: KeyedQuestion) =>
            question.number - question2.number
        )

export const keyedAnswers = (game: Game): KeyedAnswer[] =>
    _.flatten(
        keyedQuestions(game)
            .map(([qKey, question]: KeyedQuestion) =>
                question.answers.map((answer: Answer, aIdx: number) => [[...qKey, aIdx] as AnswerKey, answer])
        )
    )
export const keyedBonuses = (game: Game): KeyedBonus[] =>
    _.flatten(
        keyedCategories(game).map(([cKey, category]: KeyedCategory) =>
            category.bonuses.map((bonus: Bonus, bIdx: number) => [[...cKey, bIdx] as BonusKey, bonus])
        )
    )

export const categoryByKey = (game: Game, key: HasCategory): Category => game.categories[key[0]]
export const questionByKey = (game: Game, key: HasQuestion): Question => categoryByKey(game, key).questions[key[1]]
export const answerByKey = (game: Game, key: AnswerKey): Answer => questionByKey(game, key).answers[key[2]]
export const bonusByKey = (game: Game, key: BonusKey): Bonus => categoryByKey(game, key).bonuses[key[1]]
export const teamByKey = (game: Game, key: HasTeam): Team => game.teams[key[0]]
export const playerByKey = (game: Game, key: PlayerKey): Player => teamByKey(game, key).players[key[1]]

export const bonusesForTeam = (game: Game, teamKey: TeamKey): KeyedBonus[] =>
    keyedBonuses(game).filter(([_key, bonus]) => areKeysEqual(bonus.teamKey, teamKey))

export const answersForTeam = (game: Game, teamKey: TeamKey): KeyedAnswer[] =>
    keyedAnswers(game).filter(([_key, answer]) => areKeysEqual(answer.playerKey, teamKey))

export const answersForPlayer = (game: Game, playerKey: PlayerKey): KeyedAnswer[] =>
    keyedAnswers(game).filter(([_key, answer]) => areKeysEqual(answer.playerKey, playerKey))