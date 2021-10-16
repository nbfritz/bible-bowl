<script lang="ts">
    import type {Game} from "../lib/types";
    import {nextQuestion} from "../lib/mutations";
    import {categoriesNeedingBonus, currentQuestionKey} from "../lib/rules";

    export let game: Game
    export let update: (game: Game) => void

    $: questionKey = currentQuestionKey(game)

    $: shouldBeDisabled = (
       questionKey === undefined
       || !(categoriesNeedingBonus(game).length === 0)
    )

    const next = () => update(nextQuestion(game))
</script>

<main>
    <p>Currently on question {game.questionNumber}
        <button on:click={next} disabled={shouldBeDisabled}>NEXT!</button>
    </p>
</main>

<style>
    button {
        width: 5em;
        height: 3em;
        margin: 1em;
        padding: 0.5em;
        background-color: green;
        color: white;
        font-weight: bold;
    }

    button:disabled {
        background-color: gray;
    }
</style>