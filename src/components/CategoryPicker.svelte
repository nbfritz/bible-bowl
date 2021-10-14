<script lang="ts">
    import type {Game} from "../lib/records";
    import {keyedCategories, keyedQuestions} from "../lib/query";
    import {selectQuestion} from "../lib/mutations";

    export let game: Game
    export let update: (game: Game) => void

    const select = (questionKey) => update(selectQuestion(game, questionKey))
</script>

<main>
    {#each keyedCategories(game).toArray() as [cKey, category]}
        <p>
            {category.name}:
            {#each keyedQuestions(game, cKey).toArray() as [qKey, question]}
                <button on:click={() => select(qKey)} disabled={question.number}>{question.value}</button>
            {/each}
        </p>
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