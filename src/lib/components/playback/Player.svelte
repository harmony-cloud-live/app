<script lang="ts">
    import { controlSocket, midiSocket } from '$lib/ws';
    import {
        currentBeat,
        currentIndex,
        isLeader,
        isPlaying,
        isSustaining,
        loopEnd,
        loopStart, 
        looping,
        mainSequence,
    } from '$lib/stores';
    import * as Tone from 'tone';
    import { onDestroy } from 'svelte';
    import {
        ChevronLeftIcon,
        ChevronRightIcon,
        ExitLoopIcon,
        PauseIcon,
        PlayIcon,
    } from '$lib/icons';
    import { fly, slide } from 'svelte/transition';
    import { cubicInOut, cubicOut } from 'svelte/easing';

    $: isLooping = $loopStart !== -1 && $loopEnd !== -1;
    $: effectiveEnd = isLooping ? $loopEnd : $mainSequence.length - 1;
    $: effectiveStart = isLooping ? $loopStart : 0;

    const unsubMainSequence = mainSequence.subscribe(() => {
        $currentIndex = 0;
        $currentBeat = 0;
        $loopStart = -1;
        $loopEnd = -1;
        if (!$isLeader) return;
        $midiSocket.sendStopAll();
        // $instrument.stopAll();
    });

    const unsubCurrentIndex = currentIndex.subscribe((index) => {
        if (!$isLeader) return;
        if ($isPlaying || $isSustaining) {
            $midiSocket.sendStopAll();
            // $instrument.stopAll();
        }

        if (!$mainSequence[index]) {
            return;
        }

        if ($isPlaying || $isSustaining) {
            $midiSocket.sendChordDown(index);
            // $instrument.chordDown($mainSequence[index]);
        }

        $controlSocket.newIndex(index);
    });

    onDestroy(() => {
        unsubMainSequence();
        unsubCurrentIndex();
    });

    const startPlayback = () => {
        console.log('start playback');
        $midiSocket.sendStopAll(); 
        $midiSocket.sendChordDown($currentIndex); 

        // $instrument.stopAll();
        // $instrument.chordDown($mainSequence[$currentIndex]);

        playbackLoop.start('1m');
        Tone.Transport.start();

        $controlSocket.newBeat(0);
        $currentBeat = 0;
        $isPlaying = true;
    }

    const stopPlayback = () => {
        console.log('stop playback');
        if (!$isSustaining) {
            $midiSocket.sendStopAll(); 
            // $instrument.stopAll();
        }

        playbackLoop.stop();
        Tone.Transport.stop();

        $controlSocket.newBeat(0);
        $currentBeat = 0;
        $isPlaying = false;
    }

    const togglePlayback = () => {
        if (Tone.Transport.state === 'started') {
            stopPlayback();
        } else {
            startPlayback();
        }
    }

    const playbackLoop = new Tone.Loop(() => {
        let nextIndex = $currentIndex < $mainSequence.length - 1 ? $currentIndex + 1 : 0;

        if ($loopStart !== -1 && $loopEnd !== -1) {
            if (nextIndex > $loopEnd) {
                nextIndex = $loopStart;
            }
        }

        $currentIndex = nextIndex;
        // $midiSocket.sendChordDown($currentIndex);
    }, '1n');

    const goToPreviousIndex = () => {
        if ($currentIndex > effectiveStart) {
            $currentIndex -= 1;
        } else {
            $currentIndex = effectiveEnd;
        }
    }

    const goToNextIndex = () => {
        if ($currentIndex < effectiveEnd) {
            $currentIndex += 1;
        } else {
            $currentIndex = effectiveStart;
        }
    }

    const clearLoop = () => {
        $loopStart = -1;
        $loopEnd = -1;
    }

    isLeader.subscribe((value) => {
        if (!value) {
            clearLoop();
            playbackLoop.stop();
            Tone.Transport.stop();
        }
    });
</script>

<div class="container" transition:fly={{ y: -100, duration: 125, easing: cubicInOut }}>
    <button on:click={goToPreviousIndex}>
        <img src={ChevronLeftIcon} alt="previous" />
    </button>
    {#if $looping}
        <button
            class="clear"
            on:click={clearLoop}
            transition:slide={{ axis: 'x', easing: cubicOut, duration: 200 }}>
            <img src={ExitLoopIcon} alt="exit loop" />
        </button>
    {/if}
    <button on:click={togglePlayback}>
        {#if $isPlaying}
            <img src={PauseIcon} alt="pause" />
        {:else}
            <img class="play" src={PlayIcon} alt="play" />
        {/if}
    </button>
    <button on:click={goToNextIndex}>
        <img src={ChevronRightIcon} alt="next" />
    </button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin: .5em 0;
    }

    button {
        width: 5em;
        height: 5em;
        background: rgb(24, 24, 24);
        border-radius: 1em;
        border: 0;
        color: white;
        padding: 1em;
        cursor: pointer;
        display:flex;
        justify-content: center;
        align-items: center;
        margin: 0 .5em;
        outline: .15em transparent;

        &:active {
            filter: brightness(2);
            outline: .15em solid white;
        }
    }

    .clear {
        width: 7em;
        height: 5em;
        white-space: pre;
        font-weight: 300;
        & img {
            width: 2.3em;
            height: 2.3em;
            object-fit: contain;
        }
    }

    img {
        width: 2.5em;
        height: 2.5em;
        object-fit: contain;
    }
</style>
