<script lang="ts">
    import type {Game} from "../lib/records";
    import {scoreBonus} from "../lib/mutations";
    import {keyedTeams} from "../lib/query";
    import {categoriesNeedingBonus} from "../lib/rules";

    export let game: Game
    export let update: (game: Game) => void

    const score = (...params) => update(scoreBonus(game, ...params))
</script>

<main>
    {#each categoriesNeedingBonus(game).toArray() as [cKey, category] }
        {#each keyedTeams(game).toArray() as [tKey, team]}
            <p>
                Bonus for {team.name}:
                {#each [0, 5, 10, 15, 20] as points}
                    <button on:click={() => score(cKey, tKey, points)}>{points}</button>
                {/each}
            </p>
        {/each}
    {/each}
</main>

<style>
    button {
        width: 3em;
        height: 3em;
        margin: 0 1em;
        padding: 0.5em;
    }
</style>