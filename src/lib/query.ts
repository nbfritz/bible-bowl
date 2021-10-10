import type {
    Game, Category, Question, Bonus, Answer, PlayerPath,
    QuestionPath, AnswerPath, BonusPath, CategoryPath, TeamPath
} from './records'
import { makeCategoryPath, makeQuestionPath, makeBonusPath, makeAnswerPath } from './records'
import { List, Seq }  from 'immutable'

export type KeyPath = List<string | number>

export const keyedCategories = (game: Game): Seq.Keyed<CategoryPath, Category> =>
    Seq.Keyed(
        game.categories.map((category, categoryIndex) =>
            [makeCategoryPath({category: categoryIndex}), category]
        )
    )

export const keyedQuestions = (game: Game): Seq.Keyed<QuestionPath, Question> =>
    keyedCategories(game).flatMap((category, cKey) =>
        category.questions.map((question, qIdx) => [
            makeQuestionPath({category: cKey.category, question: qIdx}),
            question
        ])
    ).toKeyedSeq()

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

export const categoryKeyPath = (path: CategoryPath | AnswerPath | QuestionPath | BonusPath): KeyPath =>
    List(['categories', path.category])

export const bonusKeyPath = (path: BonusPath): KeyPath =>
    List(['categories', path.category, 'bonuses', path.bonus])

export const questionKeyPath = (path: QuestionPath | AnswerPath): KeyPath =>
    List(['categories', path.category, 'questions', path.question])

export const answerKeyPath = (path: AnswerPath): KeyPath =>
    List(['categories', path.category, 'questions', path.question, 'answers', path.answer])

export const bonusesForTeam = (game: Game, team: TeamPath): Seq.Keyed<BonusPath, Bonus> =>
    keyedBonuses(game).filter((bonus) => bonus.team.equals(team))

export const answersForTeam = (game: Game, team: TeamPath): Seq.Keyed<AnswerPath, Answer> =>
    keyedAnswers(game).filter((answer) => answer.player.team === team.team)

export const answersForPlayer = (game: Game, player: PlayerPath): Seq.Keyed<AnswerPath, Answer> =>
    keyedAnswers(game).filter((answer) => answer.player.equals(player))
