import * as subj from '../types'
import {areKeysEqual, getItem, getKey, KeyedTeam, makeTeam, Team} from "../types";

describe('Player', () => {
    it('initializes with correct defaults', () => {
        const player = subj.makePlayer()
        expect(player.name).toEqual('Unknown Player')
    })
})

describe('Team', () => {
    it('initializes with correct defaults', () => {
        const team = subj.makeTeam()
        expect(team.name).toEqual('Unknown Team')
        expect(team.players.length).toEqual(4)
        expect(team.players.map((p) => p.name)).toEqual([
            'Player 1', 'Player 2', 'Player 3', 'Player 4'
        ])
    })
})

describe('Answer', () => {
    it('initializes with correct defaults', () => {
        const answer = subj.makeAnswer()
        expect(answer.playerKey).toBeNull()
        expect(answer.isCorrect).toBeNull()
    })
})

describe('Question', () => {
    it('initializes with correct defaults', () => {
        const question = subj.makeQuestion()
        expect(question.number).toBeNull()
        expect(question.value).toBeNull()
        expect(question.answers.length).toEqual(0)
    })
})

describe('Bonus', () => {
    it('initializes with correct defaults', () => {
        const bonus = subj.makeBonus()
        expect(bonus.teamKey).toBeNull()
        expect(bonus.value).toBeNull()
    })
})

describe('Category', () => {
    it('initializes with correct defaults', () => {
        const category = subj.makeCategory()
        expect(category.name).toEqual('Unknown Category')
        expect(category.bonuses.length).toEqual(0)
        expect(category.questions.length).toEqual(4)
        expect(category.questions.map((q) => q.value)).toEqual([10, 15, 15, 20])
    })
})

describe('Game', () => {
    it('initializes with correct defaults', () => {
        const game = subj.makeGame()
        expect(game.categories.map((c) => c.name)).toEqual([
            'Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'
        ])
        expect(game.teams.map((t) => t.name)).toEqual(['Team 1', 'Team 2'])
        expect(game.questionNumber).toEqual(1)
    })
})

describe('areKeysEqual', () => {
    it('compares equal-length keys', () => {
        expect(areKeysEqual([1, 0], [1, 1])).toBeFalsy()
        expect(areKeysEqual([1, 1], [1, 1])).toBeTruthy()
    })

    it('compares undefined keys', () => {
        expect(areKeysEqual(undefined, [1, 1])).toBeFalsy()
    })

    it('compares different-length keys to min length', () => {
        expect(areKeysEqual([1, 0], [1, 1, 0])).toBeFalsy()
        expect(areKeysEqual([1, 1], [1, 1, 0])).toBeTruthy()
    })
})

describe('getKey', () => {
    it('retrieves the key portion of a KeyedItem', () => {
        const pair = [[0], makeTeam()] as KeyedTeam
        expect(getKey(pair)).toEqual([0])
    })
})

describe('getItem', () => {
    it('retrieves the item portion of a KeyedItem', () => {
        const team = makeTeam()
        const pair = [[0], team] as KeyedTeam
        expect(getItem<Team>(pair)).toEqual(team)
    })
})
