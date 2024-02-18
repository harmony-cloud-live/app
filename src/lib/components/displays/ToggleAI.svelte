<script lang="ts">
    import { SongIcon } from "$lib/icons";
    import { aiMode, controlSocket, currentBeat, isLeader, isLoadingMainSequence, isPlaying} from "$lib/stores";
    import { playbackLoop } from "$lib/tone";
    import { cubicInOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import * as Tone from 'tone';

    const handleClick = () => {
        if ($isLoadingMainSequence || !$isLeader)
            return;

        $aiMode = !$aiMode;

        $controlSocket.setPlaybackMode($aiMode);
        $playbackLoop.stop();
        Tone.Transport.stop();

        $controlSocket.newBeat(0);
        $currentBeat = 0;
        $isPlaying = false;
    }
</script>

<div class="container fixed-center"
    transition:fly={{ y: -100, duration: 250, easing: cubicInOut }}>
    <button on:click={handleClick}>
        <span>AI</span>
        <span><img src={SongIcon} alt="song"/></span>
        <div class="highlight" class:left={$aiMode} class:yellow-gradient={!$aiMode} class:orange-gradient={$isLeader} class:blue-gradient={!$isLeader}>
            <div class="bg"></div>
        </div>
    </button>
</div>

<style>
    img {
        object-fit: contain;
        width: 1.2em;
        height: 1.2em;
    }
    .highlight {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        border-radius: inherit;
        transition: 300ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: .15em;
        box-sizing: border-box;
    }
    
    .left {
        transform: translateX(-100%);
    }
    
    span {
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .bg {
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: #1a1a1a;
    }

    .container {
        z-index: 10;
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
        gap: 2.5em;
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