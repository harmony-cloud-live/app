<script lang='ts'>
    import { midiSocket } from "$lib/ws";
    import { getContext } from 'svelte';
    import { isLeader, isPlaying, isSustaining } from "$lib/stores";

    $: isListener = !$isLeader && getContext('isListener');

    const toggleSustain = () => {
        if ($isSustaining && !$isPlaying) {
            $midiSocket.sendStopAll();
            // $instrument.stopAll();
        }
        $isSustaining = !$isSustaining;
    };
</script>

<div class="container" class:isListener>
    <button class:active={$isSustaining} on:click={toggleSustain}>
        sustain
    </button>
</div>

<style>
    .container {
        position: relative;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: .5em;
        max-width: 80%;
    }

    button {
        font-weight: 700;
        font-size: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        text-align: center;
        width: 8em;
        height: 3em;
        background-color: #1a1a1a;
        color: #fff;
        border-radius: 1em;
        border: 0;
        cursor: pointer;
        outline: 2.5px transparent; 
    }

    button.active {
        background: linear-gradient(70deg, #00d2ff 0%, #3a47d5 100%);
        outline: 2.5px solid; 
    }

    div.isListener {
        visibility: hidden;
    }
</style>
