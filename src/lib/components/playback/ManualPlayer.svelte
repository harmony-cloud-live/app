<script lang="ts">
    import { controlSocket, midiSocket } from '$lib/ws';
    import { playbackLoop } from '$lib/tone';
    import {
        currentBeat,
        isLeader,
        isPlaying,
        isSustaining,
        manualModeCol,
        manualModeRow,
        manualProgression,
        songTitle,
    } from '$lib/stores';
    import * as Tone from 'tone';
    import {
        ChevronLeftIcon,
        ChevronRightIcon,
        StopIcon,
    } from '$lib/icons';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import type { Chord } from '$lib/types';

    const goToPreviousIndex = () => {
        if (!$isLeader || !$manualProgression) return;
        if (!$isPlaying && $isSustaining) {
            $controlSocket.manualChordUp();
        }

        if ($manualModeCol == 0) {
            if ($manualModeRow == 0) {
                $manualModeRow = $manualProgression.length - 1;
            } else {
                $manualModeRow -= 1;
            }
            $manualModeCol = $manualProgression[$manualModeRow].length - 1
        } else {
            $manualModeCol -= 1;
        }

        if (!$isPlaying && $isSustaining && $manualProgression[$manualModeRow]) {
            const chordSymbol = $manualProgression[$manualModeRow][$manualModeCol]
            if (chordSymbol)
                $controlSocket.manualChordDown($songTitle, <Chord>{chordSymbol});
        }
    }

    const goToNextIndex = () => {
        if (!$isLeader || !$manualProgression) return;
        if (!$isPlaying && $isSustaining) {
            $controlSocket.manualChordUp();
        }

        if ($manualModeCol == $manualProgression[$manualModeRow].length - 1) {
            if ($manualModeRow == $manualProgression.length - 1) {
                $manualModeRow = 0;
            } else {
                $manualModeRow += 1;
            }
            $manualModeCol = 0;
        } else {
            $manualModeCol += 1;
        }

        if (!$isPlaying && $isSustaining && $manualProgression[$manualModeRow]) {
            const chordSymbol = $manualProgression[$manualModeRow][$manualModeCol];
            if (chordSymbol)
                $controlSocket.manualChordDown($songTitle, <Chord>{chordSymbol});
        }
    }
</script>

{#if $isLeader}
    <div class="container" transition:fly={{ y: -50, duration: 150, easing: cubicInOut }}>
        <button on:pointerdown|preventDefault={goToPreviousIndex}>
            <img src={ChevronLeftIcon} alt="previous" />
        </button>
        <button on:pointerdown|preventDefault={() => {
            $midiSocket.sendStopAll();
            $playbackLoop.stop();
            Tone.Transport.stop();
            $isPlaying = false;
            $currentBeat = 0;
            $controlSocket.newBeat(0);
        }}>
            <img src={StopIcon} alt="stop" />
        </button>
        <button on:pointerdown|preventDefault={goToNextIndex}>
            <img src={ChevronRightIcon} alt="next" />
        </button>
    </div>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    button {
        width: 12em;
        height: 5.5em;
        background: rgb(24, 24, 24);
        border-radius: 2em;
        border: 0;
        color: white;
        padding: 1em;
        cursor: pointer;
        display:flex;
        justify-content: center;
        align-items: center;
        margin: 0 .5em;
        outline: .15em transparent;
        font-size: 1.2em;

        &:active {
            filter: brightness(2);
            outline: .15em solid white;
        }
    }

    img {
        width: 2.5em;
        height: 2.5em;
        object-fit: contain;
    }
</style>
