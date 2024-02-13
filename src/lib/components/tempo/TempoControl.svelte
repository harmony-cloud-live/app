<script lang='ts'>
    import TapTempo from './TapTempo.svelte';
    import { IncrementDecrement } from '$lib/components';
    import { ChevronDownIcon, ChevronUpIcon } from '$lib/icons';
    import { isLeader } from '$lib/stores';

    let expanded = false;
    $: hidden = !$isLeader;

    const MAX_TEMPO = 400;
    const MIN_TEMPO = 0;

    const clampTempo = (bpm: number) => {
        return Math.floor(Math.min(Math.max(bpm, MIN_TEMPO), MAX_TEMPO));
    }
</script>

<div class='container'>
    <div class='expand-button' on:pointerdown={() => expanded = !expanded}>
        <img src={expanded ? ChevronDownIcon : ChevronUpIcon } alt='expand' width='20' />
    </div>

    <TapTempo {expanded} {clampTempo}/>

    {#if expanded}
        <IncrementDecrement {clampTempo} />
    {/if}    
</div>

<style>
    div.expand-button {
        position: absolute;
        top: -1.75em;
        background-color: #1a1a1a;
        width: 6em;
        height: 2em;
        border-top-left-radius: 1.5em;
        border-top-right-radius: 1.5em;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    div.expand-button::after {
        content: '';
        position: absolute;
        top: -3em;
        right: -1.5em;
        bottom: 0em;
        left: -1.5em;
    }

    div.expand-button img {
        width: 2.5em;
    }

    div.container {
        position: relative;
        transition: .25s all;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 2em; 
        padding: 1em;
        background-color: #1a1a1a;

        &.down {
            background-color: #4d4d4d;
        }
    }
</style>

