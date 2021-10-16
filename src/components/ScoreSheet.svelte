<script lang="ts">
    import type {Game} from "../lib/types";
    import {sortedQuestions} from "../lib/query";

    export let game: Game
</script>

<main>
    {#each sortedQuestions(game) as [qKey, question]}
        <p>
            {question.number}: {question.value}
            {#each question.answers as answer}
                <span>[{answer.playerKey}: {answer.isCorrect ? 'Correct' : 'Incorrect'}]</span>
            {/each}
        </p>
    {/each}
</main>

<style>
    span {
        margin-right: 0.5em;
    }
</style>