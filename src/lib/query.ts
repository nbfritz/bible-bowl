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
    KeyPath,
    Player,
    PlayerKey,
    Question,
    QuestionKey,
    Team,
    TeamKey
} from './records'
import {List, Seq} from 'immutable'

export const keyedTeams = (game: Game): Seq.Keyed<TeamKey, Team> =>
    Seq.Keyed(
        game.teams.map((team, teamIndex) => [[teamIndex], team])
    )

export const keyedPlayers = (game: Game, teamKey?: TeamKey): Seq.Keyed<PlayerKey, Player> => (
    (teamKey ? Seq.Keyed([[teamKey, teamByKey(game, teamKey)]]) : keyedTeams(game))
        .flatMap((team: Team, tKey: TeamKey) =>
            team.players.map((player: Player, pIdx: number) => [[...tKey, pIdx] as PlayerKey, player]))
        .toKeyedSeq()
)

export const keyedCategories = (game: Game): Seq.Keyed<CategoryKey, Category> =>
    Seq.Keyed(
        game.categories.map((category: Category, cIdx: number) => [[cIdx] as CategoryKey, category])
    )

export const keyedQuestions = (game: Game, categoryKey?: CategoryKey): Seq.Keyed<QuestionKey, Question> =>
    (categoryKey ? Seq.Keyed([[categoryKey, categoryByKey(game, categoryKey)]]) : keyedCategories(game))
        .flatMap((category: Category, cKey: CategoryKey) =>
            category.questions.map((question: Question, qIdx: number) => [[...cKey, qIdx] as QuestionKey, question])
        )
        .toKeyedSeq()

export const sortedQuestions = (game: Game): Seq.Keyed<QuestionKey, Question> =>
    keyedQuestions(game)
        .filter((q: Question) => Boolean(q.number))
        .sortBy((q: Question) => q.number)

export const keyedAnswers = (game: Game): Seq.Keyed<AnswerKey, Answer> =>
    keyedQuestions(game).flatMap((question: Question, qKey: QuestionKey) =>
        question.answers.map((answer: Answer, aIdx: number) => [[...qKey, aIdx] as AnswerKey, answer])
    ).toKeyedSeq()

export const keyedBonuses = (game: Game): Seq.Keyed<BonusKey, Bonus> =>
    keyedCategories(game).flatMap((category: Category, cKey: CategoryKey) =>
        category.bonuses.map((bonus: Bonus, bIdx: number) => [[...cKey, bIdx] as BonusKey, bonus])
    ).toKeyedSeq()

const keysToKeyPath = <T>(...propNames: Array<String>) => (key: T): KeyPath =>
    List(propNames).flatMap((propName: String, idx: number) => [propName, key[idx]])

export const categoryKeyToPath = keysToKeyPath<HasCategory>('categories')
export const bonusKeyToPath = keysToKeyPath<BonusKey>('categories', 'bonuses')
export const questionKeyToPath = keysToKeyPath<HasQuestion>('categories', 'questions')
export const answerKeyToPath = keysToKeyPath<AnswerKey>('categories', 'questions', 'answers')
export const teamKeyToPath = keysToKeyPath<HasTeam>('teams')
export const playerKeyToPath = keysToKeyPath<PlayerKey>('teams', 'players')

export const answerByKey = (game: Game, key: AnswerKey): Answer => game.getIn(answerKeyToPath(key)) as Answer
export const questionByKey = (game: Game, key: HasQuestion): Question => game.getIn(questionKeyToPath(key)) as Question
export const bonusByKey = (game: Game, key: BonusKey): Bonus => game.getIn(bonusKeyToPath(key)) as Bonus
export const categoryByKey = (game: Game, key: HasCategory): Category => game.getIn(categoryKeyToPath(key)) as Category
export const teamByKey = (game: Game, key: HasTeam): Team => game.getIn(teamKeyToPath(key)) as Team
export const playerByKey = (game: Game, key: PlayerKey): Player => game.getIn(playerKeyToPath(key)) as Player

export const bonusesForTeam = (game: Game, teamKey: TeamKey): Seq.Keyed<BonusKey, Bonus> =>
    keyedBonuses(game).filter((bonus: Bonus) => teamKeyToPath(bonus.teamKey).equals(teamKeyToPath(teamKey)))

export const answersForTeam = (game: Game, teamKey: TeamKey): Seq.Keyed<AnswerKey, Answer> =>
    keyedAnswers(game).filter((answer: Answer) => teamKeyToPath(answer.playerKey).equals(teamKeyToPath(teamKey)))

export const answersForPlayer = (game: Game, playerKey: PlayerKey): Seq.Keyed<AnswerKey, Answer> =>
    keyedAnswers(game).filter((answer: Answer) => playerKeyToPath(answer.playerKey).equals(playerKeyToPath(playerKey)))


