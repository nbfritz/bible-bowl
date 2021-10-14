<script lang="ts">
    export let undo: () => void
</script>

<main>
    <button on:click={undo}>UNDO</button>
</main>

<style>
    button {
        width: 5em;
        height: 3em;
        margin: 1em;
        padding: 0.5em;
        background-color: red;
        color: white;
        font-weight: bold;
    }
</style>