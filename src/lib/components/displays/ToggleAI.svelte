<script lang="ts">
    import { aiMode, chordCollection, controlSocket, currentBeat, currentIndex, isLoadingMainSequence, isPlaying, mainSequence, manualModeIndex} from "$lib/stores";
    import { playbackLoop } from "$lib/tone";
    import { cubicInOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import * as Tone from 'tone';

    const handleClick = () => {
        if ($isLoadingMainSequence)
            return;

        // if ($aiMode) {
        aiToManualIndex();
        // } else {
        //     manualToAiIndex();
        // }

        $aiMode = !$aiMode;

        $controlSocket.setPlaybackMode($aiMode);
        $playbackLoop.stop();
        Tone.Transport.stop();

        $controlSocket.newBeat(0);
        $currentBeat = 0;
        $isPlaying = false;
    }
    
    const aiToManualIndex = () => {
        $manualModeIndex = 0;
        for (let i = 0; i < $chordCollection.chords.length; i++) {
            if ($mainSequence[$currentIndex] === $chordCollection.chords[i]) {
                $manualModeIndex = i;
                break;
            }
        }
        $controlSocket.setManualModeIndex($manualModeIndex);
    }
    
    // const manualToAiIndex = () => {
    //     $currentIndex = 0;
    //     for (let i = 0; i < $mainSequence.length; i++) {
    //         if ($mainSequence[i] === $chordCollection.chords[$manualModeIndex]) {
    //             $currentIndex = i;
    //             break;
    //         }
    //     }
    //     $controlSocket.newIndex($currentIndex);
    // }
</script>

<div class="container fixed-center"
    transition:fly={{ y: -100, duration: 250, easing: cubicInOut }}>
    <button class="leader" on:click={handleClick}>
        <span>AI MODE</span>
        <span>MANUAL</span>
        <div class="highlight orange-gradient" class:left={$aiMode}>
            <div class="bg"></div>
        </div>
    </button>
</div>

<style>
    .highlight {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        border-radius: inherit;
        transition: 400ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: .15em;
        box-sizing: border-box;
    }
    
    .left {
        transform: translateX(-100%);
    }
    
    span {
        z-index: 10;
    }
    
    .bg {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: #1a1a1a;
    }

    .container {
        padding: .2em;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3.5em;
        border: .2em;
        border-radius: 2.5em;
        background: #1a1a1a;
        transition: width 5s ease-in-out;
    }

    button {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2.35em;
        font-size: 1.25em;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        background: #1a1a1a;
        border-radius: inherit;
        height: inherit;
        border: inherit;
        transition: width 5s ease-in-out;
    }
</style>