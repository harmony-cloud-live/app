<script lang='ts'>
    import { currentBeat, controlSocket, isPlaying, timeSignature } from '$lib/stores';
    import { onMount } from 'svelte';
    import * as Tone from 'tone';

    let beatsPerBar: number;
    let beatValue: number;

    $: if ($timeSignature) {
        beatsPerBar = $timeSignature.upper;
        beatValue = $timeSignature.lower;
    } 

    onMount(() => {
        const beatLoop = new Tone.Loop(() => {
            $currentBeat = ($currentBeat + 1) % beatsPerBar;
            $controlSocket.newBeat($currentBeat);
        }, `${beatValue}n`).start();

        isPlaying.subscribe(() => {
            if ($isPlaying) {
                beatLoop.start(`+${beatValue}n`);
            } else {
                beatLoop.stop();
            }
        });
    });

</script>

<div class="container">
    {#each Array(beatsPerBar) as _, i (i)}
        <div class="beat" class:current={$currentBeat === i}>
            {i + 1}
        </div>
    {/each}
</div>

<style>
    div.container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1em;
        width: 100%;
        height: 100%;
        margin-bottom: .5em;
    }
    
    div.beat {
        font-size: 1.25em;
        font-weight: 500;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.25em;
        height: 1.25em;
        border-radius: 30em;
        padding: 1em;
        background-color: #1a1a1a;
        outline: 2.5px solid transparent; 
    }

    div.current {
        outline: 2.5px solid; 
    }
</style>
