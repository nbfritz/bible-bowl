<script lang="ts">
    import type {Game} from "../lib/types";
    import {keyedPlayers, keyedTeams, teamByKey} from "../lib/query";
    import {scoreForPlayer, scoreForTeam} from "../lib/rules";

    export let game: Game
</script>

<main>
    {#each keyedTeams(game) as [tKey, team]}
        <h1>{teamByKey(game, tKey).name} Score: <strong>{scoreForTeam(game, tKey)}</strong></h1>
        {#each keyedPlayers(game, tKey) as [pKey, player]}

            <span class="{(scoreForPlayer(game, pKey) >= 75) ? 'buzzed-out' : ''}">
                {player.name}: {scoreForPlayer(game, pKey)}
            </span>
        {/each}
    {/each}
</main>

<style>
    span {
        margin: 0 2em;
    }

    span.buzzed-out {
        color: red;
    }
</style>