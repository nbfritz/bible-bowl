<script lang="ts">
    import {makeGame, QuestionKey} from './lib/types'
    import {currentQuestionKey, gameNeedsCategoryChoice} from './lib/rules'
    import CategoryPicker from "./components/CategoryPicker.svelte";
    import BonusScorer from "./components/BonusScorer.svelte";
    import AnswerScorer from "./components/AnswerScorer.svelte";
    import TeamScores from "./components/TeamScores.svelte";
    import QuestionFooter from "./components/QuestionFooter.svelte";
    import ScoreSheet from "./components/ScoreSheet.svelte";
    import UndoButton from "./components/UndoButton.svelte";

    let game = makeGame()
    let history = []
    let questionKey: QuestionKey

    const update = (newGame) => {
        history.push(game)
        game = newGame
    }
    const undo = () => game = history.pop() || makeGame()

    $: questionKey = currentQuestionKey(game)

</script>

<main>
    <UndoButton {undo} />

    <TeamScores {game} />

    <hr>

    {#if gameNeedsCategoryChoice(game)}
        <CategoryPicker {game} {update} />
    {/if}

    {#if !gameNeedsCategoryChoice(game)}
        {#if questionKey}<AnswerScorer {game} {update} />{/if}
        <BonusScorer {game} {update} />
        <QuestionFooter {game} {update} />
    {/if}

    <hr>

    <ScoreSheet {game} />
</main>

<style>
</style>