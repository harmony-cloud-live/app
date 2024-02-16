<script>
    import {
        chordCollection, mainSequence,
    } from '$lib/stores';
    import ManualButton from './ManualButton.svelte';


    let fontSize = 1;
    $: {
        const length = $chordCollection.chords.length;
        if (length <= 8) fontSize = 2.5;
        else if (length <= 18) fontSize = 2.25;
        else if (length <= 24) fontSize = 2;
        else if (length <= 32) fontSize = 1.75;
        else if (length <= 64) fontSize = 1.5;
    };
</script>

<div class="container">
    {#each $chordCollection.chords as chord, index (index)}
        <ManualButton {chord} {index} {fontSize}/>
    {/each}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-wrap: wrap;
        gap: .5em;
        width: 98vw;
        max-height: 70vh;
    }
</style>
