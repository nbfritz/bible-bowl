<script lang="ts">
    import type {Game} from "../lib/records";
    import {keyedTeams, teamByKey} from "../lib/query";
    import {scoreForTeam} from "../lib/rules";

    export let game: Game
</script>

<main>
    {#each keyedTeams(game).toArray() as [tKey, team]}
        <h1>{teamByKey(game, tKey).name} Score: <strong>{scoreForTeam(game, tKey)}</strong></h1>
    {/each}
</main>

<style>
</style>