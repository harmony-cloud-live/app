<script lang="ts">
    import { controlSocket, midiSocket } from '$lib/ws';
    import { togglePlayback, playbackLoop } from '$lib/tone';
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
