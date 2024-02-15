<script>
    import {
        chordCollection,
    } from '$lib/stores';
    import ManualButton from './ManualButton.svelte';
</script>

<div class="container">
    {#each $chordCollection.chords as chord, index (index)}
        <ManualButton {chord} {index}/>
    {/each}
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: .5em;
        max-width: 92%;
    }
</style>
