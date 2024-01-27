<script lang='ts'>
    import { midiSocket } from "$lib/ws";
    import { isLeader, isPlaying, isSustaining } from "$lib/stores";

    $: hidden = !$isLeader;
    $: active = $isSustaining;

    const toggleSustain = () => {
        if ($isLeader && $isSustaining && !$isPlaying) {
            $midiSocket.sendStopAll();
        }
        $isSustaining = !$isSustaining;
    };
</script>

<div class="container"
    class:hidden
    class:active>
    <button on:click={toggleSustain}>
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
        transition: .25s all;
        border-radius: 2.5em;
        padding: .25em;
        height: 4.5em;
    }

    button {
        width: 8em;
        font-weight: 700;
        font-size: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        text-align: center;
        background-color: #1a1a1a;
        color: #fff;
        border-radius: inherit;
        border: inherit;
        height: inherit;
    }
    
    .active {
        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%, #cc2366 75%, #bc1888 100%);
    }

    .hidden {
        margin-bottom: -5em;
    }
</style>
