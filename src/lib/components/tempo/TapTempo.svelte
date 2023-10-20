<script lang='ts'>
    import { settings } from '$lib/stores';
    import { slide } from 'svelte/transition';
    import { MetronomeIcon } from '$lib/icons';

    export let clampTempo: (tempo: number) => number;
    export let expanded: boolean;

    const TAP_TEMPO_WINDOW = 4;
    const TAP_TEMPO_TIMEOUT = 2000;
    const PROMPT_TIMEOUT = 3000;

    let tapIntervals: number[] = [];
    let tapTimeout: any;
    let lastTimestamp: number = 0;
    let metronomeLeft = true;

    let showTapPrompt = true;
    $: showTapPrompt = expanded;

    let tapPromptTimeout: any;
    $: if (showTapPrompt) {
        clearTimeout(tapPromptTimeout);
        tapPromptTimeout = setTimeout(() => {
            showTapPrompt = false;
            clearTimeout(tapPromptTimeout);
        }, PROMPT_TIMEOUT);
    }

    function handleTapTempo() {
        metronomeLeft = !metronomeLeft;
        showTapPrompt = true;

        const now = Date.now();
        if (lastTimestamp !== 0) {
            const diffMs = (now - lastTimestamp) / 1000;
            tapIntervals.push(diffMs);

            if (tapIntervals.length > TAP_TEMPO_WINDOW)
                tapIntervals.shift();
        }
        lastTimestamp = now;

        if (tapIntervals.length >= 3) {
            const averageDiff = tapIntervals.reduce((a, b) => a + b, 0) / tapIntervals.length;
            const bpm = 60 / averageDiff;
            $settings.tempo = clampTempo(bpm);
        }

        clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => {
            tapIntervals.length = 0;
            lastTimestamp = 0;
        }, TAP_TEMPO_TIMEOUT); 

        clearTimeout(tapPromptTimeout);
        tapPromptTimeout = setTimeout(() => {
            showTapPrompt = false;
            clearTimeout(tapPromptTimeout);
        }, PROMPT_TIMEOUT);
    }
</script>

<button class='tap-tempo' on:pointerdown={handleTapTempo}>
    {#if expanded || showTapPrompt}
        <img transition:slide={{ duration: 200 }} 
            class={metronomeLeft ? 'left' : 'right'}
            class:tapping={lastTimestamp > 0}
            src={MetronomeIcon}
            alt='Metronome' 
        />
    {/if}
    <div class='bpm'>
        <strong>{$settings.tempo}</strong>
        {#if !expanded}
            <small>bpm</small>
        {/if}
    </div>
    {#if showTapPrompt}
        <div transition:slide={{ duration: 200 }} class="prompt">
            Tap Tempo
        </div>
    {/if}
    </button>

<style>
    button.tap-tempo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 1.75em;
        padding: .5em 1em;
        min-width: 13em;
        background-color: rgb(34, 34, 34);

        &:active {
            background-color: rgb(51, 51, 51);
        }
    }

    img {
        width: 3em;
        height: 3em;
        margin-bottom: 0.15em;

        &.right {
            transform: scaleX(-1);
        }
    }
    
    .prompt {
        text-transform: lowercase;
        font-size: 1.5em;
        font-weight: 500;
        margin-bottom: .25em;
    }

    .bpm {
        font-size: 3.5em;
        font-weight: 500;
    }

    small {
        font-size: .5em;
    }
</style>