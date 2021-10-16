<script lang="ts">
    import type {CategoryKey, Game} from "../lib/types";
    import {keyedCategories, keyedQuestions} from "../lib/query";
    import {selectQuestion} from "../lib/mutations";
    import {areKeysEqual} from "../lib/types";
    import produce from "immer";

    export let game: Game
    export let update: (game: Game) => void

    let categoryBeingEdited: CategoryKey = undefined
    let categoryEditedValue: string = undefined

    const select = (questionKey) => update(selectQuestion(game, questionKey))
    const editCategory = (cKey: CategoryKey, initialName: string) => {
        categoryBeingEdited = cKey
        categoryEditedValue = initialName
    }
    const change = (event) => categoryEditedValue = event.target.value
    const handleEnter = (event) => { if (event.keyCode === 13) event.target.blur() }
    const submitChange = () => {
        update(produce(game, draft => {
            draft.categories[categoryBeingEdited[0]].name = categoryEditedValue
            categoryBeingEdited = undefined
        }))
    }
</script>

<main>
    {#each keyedCategories(game) as [cKey, category]}
        {#if !areKeysEqual(cKey, categoryBeingEdited)}
            <h2 on:click={() => editCategory(cKey, category.name)}>{category.name}:</h2>
        {/if}
        {#if areKeysEqual(cKey, categoryBeingEdited)}
            <input on:blur={submitChange} on:change={change} on:keyup={handleEnter} value={categoryEditedValue} />
        {/if}
        <p>
            {#each keyedQuestions(game, cKey) as [qKey, question]}
                <button on:click={() => select(qKey)} disabled={question.number}>{question.value}</button>
            {/each}
        </p>
    {/each}
</main>

<style>
    button {
        width: 20%;
        height: 2em;
        margin: 0 1em;
        padding: 0.5em;
        font-size: 1.5em;
        font-weight: bold;
    }
</style>