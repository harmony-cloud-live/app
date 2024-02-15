<script lang="ts">
    import { controlSocket, midiSocket } from '$lib/ws';
    import { togglePlayback, playbackLoop, stopPlayback } from '$lib/tone';
    import {
        currentBeat,
        currentIndex,
        previousIndex,
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
        StopIcon,
    } from '$lib/icons';
    import { fly, slide } from 'svelte/transition';
    import { cubicInOut, cubicOut } from 'svelte/easing';

    let wasLooping = false;
    $: isLooping = $loopStart !== -1 && $loopEnd !== -1;
    $: effectiveEnd = isLooping ? $loopEnd : $mainSequence.length - 1;
    $: effectiveStart = isLooping ? $loopStart : 0;
    $: if ($isLeader) {
        if (wasLooping && !isLooping) {
            wasLooping = false;
            $controlSocket.newLoop($loopStart, $loopEnd);
        } else if (!wasLooping && isLooping) {
            wasLooping = true;
            $controlSocket.newLoop($loopStart, $loopEnd);
        }
    }

    const unsubMainSequence = mainSequence.subscribe(() => {
        $currentIndex = 0;
        $currentBeat = 0;
        $loopStart = -1;
        $loopEnd = -1;
        if (!$isLeader) return;
    });

    const unsubCurrentIndex = currentIndex.subscribe((index) => {
        if (!$isLeader || !$mainSequence[index]) 
            return;

        if ($isPlaying) {
            if ($mainSequence[$previousIndex])
                $midiSocket.sendChordUp($previousIndex);
            $midiSocket.sendChordDown(index);
        }

        $controlSocket.newIndex(index);
        $previousIndex = index;
    });

    onDestroy(() => {
        unsubMainSequence();
        unsubCurrentIndex();
    });

    const goToPreviousIndex = () => {
        if (!$isLeader) return;
        if (!$isPlaying && $isSustaining) {
            $midiSocket.sendChordUp($previousIndex);
        }

        if ($currentIndex > effectiveStart) {
            $currentIndex -= 1;
        } else {
            $currentIndex = effectiveEnd;
        }

        if (!$isPlaying && $isSustaining) {
            $midiSocket.sendChordDown($currentIndex);
        }
    }

    const goToNextIndex = () => {
        if (!$isLeader) return;
        if (!$isPlaying && $isSustaining) {
            $midiSocket.sendChordUp($previousIndex);
        }

        if ($currentIndex < effectiveEnd) {
            $currentIndex += 1;
        } else {
            $currentIndex = effectiveStart;
        }

        if (!$isPlaying && $isSustaining) {
            $midiSocket.sendChordDown($currentIndex);
        }
    }

    const clearLoop = () => {
        $loopStart = -1;
        $loopEnd = -1;
    }

    isLeader.subscribe((value) => {
        if (!value) {
            clearLoop();
            $playbackLoop.stop();
            Tone.Transport.stop();
        }
    });
</script>

{#if $isLeader}
    <div class="container" transition:fly={{ y: -50, duration: 150, easing: cubicInOut }}>
        <button on:pointerdown|preventDefault={goToPreviousIndex}>
            <img src={ChevronLeftIcon} alt="previous" />
        </button>
        {#if $looping}
            <button
                class="clear"
                on:pointerdown|preventDefault={clearLoop}
                transition:slide={{ axis: 'x', easing: cubicOut, duration: 200 }}>
                <img src={ExitLoopIcon} alt="exit loop" />
            </button>
        {/if}
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
        <button on:click={togglePlayback}>
            {#if $isPlaying}
                <img src={PauseIcon} alt="pause" />
            {:else}
                <img class="play" src={PlayIcon} alt="play" />
            {/if}
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
        margin: .5em 0;
    }

    button {
        width: 6em;
        height: 6em;
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

    .clear {
        width: 8em;
        height: 6em;
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
