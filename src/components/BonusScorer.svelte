<script lang="ts">
    import type {Game} from "../lib/types";
    import {scoreBonus} from "../lib/mutations";
    import {keyedTeams} from "../lib/query";
    import {categoriesNeedingBonus} from "../lib/rules";

    export let game: Game
    export let update: (game: Game) => void

    const score = (...params) => update(scoreBonus(game, ...params))
</script>

<main>
    {#each categoriesNeedingBonus(game) as [cKey, category] }
        {#each keyedTeams(game) as [tKey, team]}
            <h2>Bonus for {team.name}:</h2>
            <p>
                {#each [0, 5, 10, 15, 20] as points}
                    <button on:click={() => score(cKey, tKey, points)}>{points}</button>
                {/each}
            </p>
        {/each}
    {/each}
</main>

<style>
    button {
        width: 15%;
        height: 2em;
        margin: 0 1em;
        padding: 0.5em;
        font-size: 1.5em;
        font-weight: bold;
    }
</style>