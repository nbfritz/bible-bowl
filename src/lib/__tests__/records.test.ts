import * as subj from '../records'
import { List } from 'immutable'

describe('Player', () => {
    it('initializes with correct defaults', () => {
        const player = subj.makePlayer()
        expect(player.name).toEqual("")
    })
})

describe('Team', () => {
    it('initializes with correct defaults', () => {
        const team = subj.makeTeam()
        expect(team.name).toEqual("")
        expect(team.players.size).toEqual(4)
    })
})

describe('Answer', () => {
    it('initializes with correct defaults', () => {
        const answer = subj.makeAnswer()
        expect(answer.player).toBeNull()
        expect(answer.isCorrect).toBeNull()
    })
})

describe('Question', () => {
    it('initializes with correct defaults', () => {
        const question = subj.makeQuestion()
        expect(question.number).toBeNull()
        expect(question.value).toBeNull()
        expect(question.answers.size).toEqual(0)
    })
})

describe('Bonus', () => {
    it('initializes with correct defaults', () => {
        const bonus = subj.makeBonus()
        expect(bonus.team).toBeNull()
        expect(bonus.value).toBeNull()
    })
})

describe('Category', () => {
    it('initializes with correct defaults', () => {
        const category = subj.makeCategory()
        expect(category.name).toEqual("")
        expect(category.bonuses.size).toEqual(0)
        expect(category.questions.size).toEqual(4)
        expect(category.questions.map((q) => q.value)).toEqual(List([10, 15, 15, 20]))
    })
})

describe('Game', () => {
    it('initializes with correct defaults', () => {
        const game = subj.makeGame()
        expect(game.categories.size).toEqual(5)
        expect(game.teams.size).toEqual(2)
        expect(game.questionNumber).toEqual(1)
    })
})

describe('CategoryPath', () => {
    it('initializes with correct defaults', () => {
        const path = subj.makeCategoryPath()
        expect(path.category).toEqual(null)
    })
})

describe('BonusPath', () => {
    it('initializes with correct defaults', () => {
        const path = subj.makeBonusPath()
        expect(path.category).toEqual(null)
        expect(path.bonus).toEqual(null)
    })
})

describe('QuestionPath', () => {
    it('initializes with correct defaults', () => {
        const path = subj.makeQuestionPath()
        expect(path.category).toEqual(null)
        expect(path.question).toEqual(null)
    })
})

describe('AnswerPath', () => {
    it('initializes with correct defaults', () => {
        const path = subj.makeAnswerPath()
        expect(path.category).toEqual(null)
        expect(path.question).toEqual(null)
        expect(path.answer).toEqual(null)
    })
})

describe('TeamPath', () => {
    it('initializes with correct defaults', () => {
        const path = subj.makeTeamPath()
        expect(path.team).toEqual(null)
    })
})

describe('PlayerPath', () => {
    it('initializes with correct defaults', () => {
        const path = subj.makePlayerPath()
        expect(path.team).toEqual(null)
        expect(path.player).toEqual(null)
    })
})
