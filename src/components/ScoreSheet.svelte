<script lang="ts">
    import type {Game} from "../lib/records";
    import {nextQuestion} from "../lib/mutations";
    import {sortedQuestions} from "../lib/query";

    export let game: Game
</script>

<main>
    {#each sortedQuestions(game).toArray() as [qKey, question]}
        <p>
            {question.number}: {question.value}
            {#each question.answers.toArray() as answer}
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