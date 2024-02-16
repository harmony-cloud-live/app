<script>
    import { ChordButton } from '$lib/components';
    import {
        mainSequence,
        loopStart,
        loopEnd,
        dragging,
        currentIndex,
    } from '$lib/stores';

    // clear the loop so we don't get stuck in loop selection 
    const handleGlobalUp = () => {
        $dragging = false;
        if ($loopStart !== -1 && $loopEnd !== -1 && $loopStart < $loopEnd) {
            console.log('not clearing loop selection on pointer up', $loopStart, 'to', $loopEnd);
            return; 
        }
        $loopStart = -1;
        $loopEnd = -1;
    }

    let fontSize = 1;
    $: {
        const length = $mainSequence.length;
        if (length <= 8) fontSize = 2.5;
        else if (length <= 16) fontSize = 2.25;
        else if (length <= 24) fontSize = 2;
        else if (length <= 32) fontSize = 1.5;
        else if (length <= 64) fontSize = 1;
    };
</script>

<svelte:window on:pointerup={handleGlobalUp} />

<div class="container">
    {#each $mainSequence as chord, index (index)}
        <ChordButton {chord} {index} {fontSize}
            isCurrent={index === $currentIndex}
            isLoopStart={index === $loopStart}
            isLoopEnd={index === $loopEnd}
            isInLoop={$loopStart !== -1 && $loopEnd !== -1 && index >= $loopStart && index <= $loopEnd}
        />
    {/each}
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: .5em;
        max-width: 95%;
    }
</style>
