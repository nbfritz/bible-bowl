import type {
    Answer,
    AnswerPath,
    Bonus,
    BonusPath,
    Category,
    CategoryPath,
    Game,
    Player,
    PlayerPath,
    Question,
    QuestionPath,
    Team,
    TeamPath
} from './records'
import {
    makeAnswerPath,
    makeBonusPath,
    makeCategoryPath,
    makePlayerPath,
    makeQuestionPath,
    makeTeamPath
} from './records'
import {List, Seq} from 'immutable'

export type KeyPath = List<string | number>

export const keyedTeams = (game: Game): Seq.Keyed<TeamPath, Team> =>
    Seq.Keyed(
        game.teams.map((team, teamIndex) =>
            [makeTeamPath({team: teamIndex}), team]
        )
    )

export const keyedPlayers = (game: Game, teamPath?: TeamPath): Seq.Keyed<PlayerPath, Player> => (
    (teamPath ? Seq.Keyed([[teamPath, teamByPath(game, teamPath)]]) : keyedTeams(game))
        .flatMap((team, tKey) =>
            team.players.map((player, pIdx) => [
                makePlayerPath({team: tKey.team, player: pIdx}),
                player
            ])
        )
        .toKeyedSeq()
)

export const keyedCategories = (game: Game): Seq.Keyed<CategoryPath, Category> =>
    Seq.Keyed(
        game.categories.map((category, categoryIndex) =>
            [makeCategoryPath({category: categoryIndex}), category]
        )
    )

export const keyedQuestions = (game: Game, categoryPath?: CategoryPath): Seq.Keyed<QuestionPath, Question> =>
    (categoryPath ? Seq.Keyed([[categoryPath, categoryByPath(game, categoryPath)]]) : keyedCategories(game))
        .flatMap((category, cKey) =>
            category.questions.map((question, qIdx) => [
                makeQuestionPath({category: cKey.category, question: qIdx}),
                question
            ])
        )
        .toKeyedSeq()

export const sortedQuestions = (game: Game): Seq.Keyed<QuestionPath, Question> =>
    keyedQuestions(game)
        .filter((q) => Boolean(q.number))
        .sortBy((q) => q.number)

export const keyedAnswers = (game: Game): Seq.Keyed<AnswerPath, Answer> =>
    keyedQuestions(game).flatMap((question, qKey) =>
        question.answers.map((answer, aIdx) => [
            makeAnswerPath({category: qKey.category, question: qKey.question, answer: aIdx}),
            answer
        ])
    ).toKeyedSeq()

export const keyedBonuses = (game: Game): Seq.Keyed<BonusPath, Bonus> =>
    keyedCategories(game).flatMap((c, cKey) =>
        c.bonuses.map((bonus, bIdx) => [
            makeBonusPath({category: cKey.category, bonus: bIdx}),
            bonus
        ])
    ).toKeyedSeq()

export const answerByPath = (game: Game, path: AnswerPath): Answer =>
    game.getIn(answerKeyPath(path)) as Answer

export const questionByPath = (game: Game, path: QuestionPath | AnswerPath): Question =>
    game.getIn(questionKeyPath(path)) as Question

export const bonusByPath = (game: Game, path: BonusPath): Bonus =>
    game.getIn(bonusKeyPath(path)) as Bonus

export const categoryByPath = (game: Game, path: CategoryPath | BonusPath | QuestionPath | AnswerPath): Category =>
    game.getIn(categoryKeyPath(path)) as Category

export const teamByPath = (game: Game, path: TeamPath | PlayerPath): Team =>
    game.getIn(teamKeyPath(path)) as Team

export const playerByPath = (game: Game, path: PlayerPath): Player =>
    game.getIn(playerKeyPath(path)) as Player

export const categoryKeyPath = (path: CategoryPath | AnswerPath | QuestionPath | BonusPath): KeyPath =>
    List(['categories', path.category])

export const bonusKeyPath = (path: BonusPath): KeyPath =>
    List(['categories', path.category, 'bonuses', path.bonus])

export const questionKeyPath = (path: QuestionPath | AnswerPath): KeyPath =>
    List(['categories', path.category, 'questions', path.question])

export const answerKeyPath = (path: AnswerPath): KeyPath =>
    List(['categories', path.category, 'questions', path.question, 'answers', path.answer])

export const teamKeyPath = (path: TeamPath | PlayerPath): KeyPath =>
    List(['teams', path.team])

export const playerKeyPath = (path: PlayerPath): KeyPath =>
    List(['teams', path.team, 'players', path.player])

export const bonusesForTeam = (game: Game, team: TeamPath): Seq.Keyed<BonusPath, Bonus> =>
    keyedBonuses(game).filter((bonus) => bonus.team.equals(team))

export const answersForTeam = (game: Game, team: TeamPath): Seq.Keyed<AnswerPath, Answer> =>
    keyedAnswers(game).filter((answer) => answer.player.team === team.team)

export const answersForPlayer = (game: Game, player: PlayerPath): Seq.Keyed<AnswerPath, Answer> =>
    keyedAnswers(game).filter((answer) => answer.player.equals(player))
