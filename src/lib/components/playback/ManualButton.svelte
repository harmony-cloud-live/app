<script lang="ts">
    import { controlSocket } from "$lib/ws";
    import {
        mainSequence,
        isSustaining,
        isLeader,
        manualModeIndex,
        songTitle,
    } from "$lib/stores";
    import type { Chord } from "$lib/types";

    export let chord: string;
    export let index: number;

    let fontSize = 1;
    $: {
        const length = $mainSequence.length;
        if (length <= 8) fontSize = 2.5;
        else if (length <= 16) fontSize = 2.25;
        else if (length <= 24) fontSize = 2;
        else if (length <= 32) fontSize = 1.5;
        else if (length <= 64) fontSize = 1;
    };

    const handleDown = () => {
        $controlSocket.manualChordUp();
        $controlSocket.manualChordDown($songTitle, <Chord>{chordSymbol: chord});
        $manualModeIndex = index;
    };

    const handleUp = () => {
        if (!$isSustaining && $manualModeIndex === index) {
            $controlSocket.manualChordUp();
        }
    };

    $: isListener = !$isLeader;
</script>

<button
    class:isListener
    class:isCurrent={index === $manualModeIndex}
    style={`font-size: ${fontSize}em`}
    on:pointerdown|preventDefault={handleDown}
    on:pointerup|preventDefault={handleUp}>
    {chord}
</button>

<style>
    button {
        position: relative;
        border-radius: .75em;
        border: 0 transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        color: var(--color-text-1);
        cursor: pointer;
        outline: 3px transparent;
        transition:
            outline-width 0.2s,
            outline-color 0.25s,
            border-radius 0.25s;
        touch-action: none;
    }

    button.isCurrent {
        background: linear-gradient(90deg, #F7971E, #e8bd00);
    }
</style>
