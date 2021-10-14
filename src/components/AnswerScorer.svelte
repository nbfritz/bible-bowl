<script lang="ts">
    import type {Game, PlayerKey, QuestionKey, TeamKey} from "../lib/records";
    import {scoreAnswer} from "../lib/mutations";
    import {keyedPlayers, keyedTeams, playerKeyToPath, questionByKey, teamKeyToPath} from "../lib/query";
    import {currentQuestionKey} from "../lib/rules";

    export let game: Game
    export let update: (game: Game) => void

    $: questionKey = currentQuestionKey(game)

    const answer = (...params) => update(scoreAnswer(game, ...params))

    const shouldBeDisabled = (questionKey: QuestionKey, playerKey: PlayerKey, teamKey: TeamKey): Boolean => {
        const answers = questionByKey(game, questionKey).answers
        if (answers.size == 0)
            return false

        return teamKeyToPath(answers.first().playerKey).equals(teamKeyToPath(teamKey))
            || answers.last().isCorrect
            || answers.map((a) => playerKeyToPath(a.playerKey)).includes(playerKeyToPath(playerKey))
    }
</script>

<main>
    {#each keyedTeams(game).toArray() as [tKey, team]}
        <p>
            {#each keyedPlayers(game, tKey).toArray() as [pKey, player]}
                <button class="button--yes"
                        on:click={() => answer(questionKey, pKey, true)}
                        disabled={shouldBeDisabled(questionKey, pKey, tKey)}
                >{player.name} YES</button>
                <button class="button--no"
                        on:click={() => answer(questionKey, pKey, false)}
                        disabled={shouldBeDisabled(questionKey, pKey, tKey)}
                >{player.name} NO</button>
            {/each}
        </p>
    {/each}
</main>

<style>
    button {
        min-width: 10em;
        height: 3em;
        margin: 1em;
        padding: 0.5em;
    }

    button.button--yes { margin-right: 0 }
    button.button--no { margin-left: 0 }
</style>