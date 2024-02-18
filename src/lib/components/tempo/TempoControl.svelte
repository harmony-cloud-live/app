<script lang='ts'>
    import TapTempo from './TapTempo.svelte';
    import { IncrementDecrement } from '$lib/components';
    import { aiMode, isPlaying } from '$lib/stores';
    
    $: active = $isPlaying;
    $: disabled = !$aiMode;

    const MAX_TEMPO = 400;
    const MIN_TEMPO = 0;

    const clampTempo = (bpm: number) => {
        return Math.floor(Math.min(Math.max(bpm, MIN_TEMPO), MAX_TEMPO));
    }
</script>

<div class='container' class:active class:disabled>
    <IncrementDecrement {clampTempo}>
        <TapTempo {clampTempo}/>
    </IncrementDecrement>
</div>

<style>
    div.container {
        position: relative;
        transition: .25s all;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 3em; 
        width: 15em;
        padding: .25em;
        
        &.active {
            background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%, #cc2366 75%, #bc1888 100%);
        }
        
        &.disabled {
            pointer-events: none;
            opacity: .4;
        }
    }
</style>

