<script lang="ts">
    import { controlSocket } from "$lib/ws";
    import {
        isSustaining,
        isLeader,
        songTitle,
        manualModeRow,
        manualModeCol,
    } from "$lib/stores";
    import type { Chord } from "$lib/types";

    export let chordSymbol: string;
    export let fontSize: number;
    export let row: number;
    export let col: number;
    
    $: isCurrent = row === $manualModeRow && col === $manualModeCol
    $: isListener = !$isLeader;

    const handleDown = () => {
        $controlSocket.manualChordUp();
        $controlSocket.manualChordDown($songTitle, <Chord>{chordSymbol});
        $controlSocket.setManualModeChord(row, col);
        $manualModeRow = row;
        $manualModeCol = col;
    };

    const handleUp = () => {
        if (!$isSustaining && isCurrent) {
            $controlSocket.manualChordUp();
        }
    };
</script>

<button
    class:isListener
    class:isCurrent
    style={`font-size: ${fontSize}em`}
    on:pointerdown|preventDefault={handleDown}
    on:pointerup|preventDefault={handleUp}>
    {chordSymbol}
</button>

<style>
    button {
        position: relative;
        border-radius: .75em;
        border: 0 transparent;
        padding: 0.7em 1em;
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
