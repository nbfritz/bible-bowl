<script lang="ts">
    import type {Game, PlayerKey, QuestionKey, TeamKey} from "../lib/types";
    import {scoreAnswer} from "../lib/mutations";
    import {keyedPlayers, keyedTeams, questionByKey} from "../lib/query";
    import {currentQuestionKey, scoreForPlayer} from "../lib/rules";
    import {areKeysEqual} from "../lib/types";

    export let game: Game
    export let update: (game: Game) => void

    $: questionKey = currentQuestionKey(game)

    const answer = (...params) => update(scoreAnswer(game, ...params))

    const shouldBeDisabled = (questionKey: QuestionKey, playerKey: PlayerKey, teamKey: TeamKey): Boolean => {
        const answers = questionByKey(game, questionKey).answers
        if (scoreForPlayer(game, playerKey) >= 75) return true
        if (answers.length == 0) return false

        return areKeysEqual(answers[0].playerKey, teamKey)
            || answers[answers.length - 1].isCorrect
            || answers.some((a) => areKeysEqual(a.playerKey, playerKey))
    }
</script>

<main>
    {#each keyedTeams(game) as [tKey, team]}
        <h2>{team.name}</h2>
        <p>
            {#each keyedPlayers(game, tKey) as [pKey, player]}
                <button class="button--yes"
                        on:click={() => answer(questionKey, pKey, true)}
                        disabled={shouldBeDisabled(questionKey, pKey, tKey)}
                >{player.name} Right</button>
                <button class="button--no"
                        on:click={() => answer(questionKey, pKey, false)}
                        disabled={shouldBeDisabled(questionKey, pKey, tKey)}
                >{player.name} Wrong</button>
            {/each}
        </p>
    {/each}
</main>

<style>
    button {
        width: 20%;
        height: 3em;
        margin: 1em;
        padding: 0.5em;
    }

    button.button--yes { margin-right: 0 }
    button.button--no { margin-left: 0 }
</style>