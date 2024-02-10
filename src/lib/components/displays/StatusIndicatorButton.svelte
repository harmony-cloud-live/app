<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { controlSocket, midiSocketReady } from "$lib/stores";
    import { Circle3 } from "svelte-loading-spinners";
    import { ChevronRightIcon } from "$lib/icons";
    import { fly } from "svelte/transition";
    import { initTone } from "$lib/tone";
    
    let timeout: any;
    let timedOut = false;

    $: reload = timedOut && !$midiSocketReady;

    const handleClick = async () => {
        if (reload) window.location.reload();
        if (!$midiSocketReady) return; // sanity check this

        await initTone();
        $controlSocket.getLeader();
        $controlSocket.getMainSequence();
        $controlSocket.getIndex();
        $controlSocket.getBeat();
        $controlSocket.getClients();
        $controlSocket.getTimeSignature();
    };

    onMount(() => {
        timeout = setTimeout(() => {
            timedOut = true;
        }, 5000);
    });

    onDestroy(() => {
        clearTimeout(timeout);
    });
</script>


<button in:fly class={($midiSocketReady ? "green" : "yellow") + "-gradient"} on:click={handleClick}>
    {#if $midiSocketReady}
        <span class="status">
            START
            <img src={ChevronRightIcon} alt="check" width="25" /> 
        </span>
    {:else}
        <span class="status">
            {#if reload}
                retry?
            {:else}
                loading midi port...
            {/if}
            <Circle3
                ballTopLeft="white"
                ballTopRight="white"
                ballBottomLeft="white"
                ballBottomRight="white"
                duration="1.5s"
                size={30}
            />
        </span>
    {/if}
</button>

<style>
    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .5em;
    }

    button {
        border-radius: 1.5em;
        box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
        border: 0 transparent;
        padding: 0.6em 1.2em;
        font-weight: 700;
        font-size: 1.25rem;
        text-transform: uppercase;
        text-decoration: none;
        background-color: transparent;
        color: var(--color-text-1);
        cursor: pointer;
        box-shadow: 0 0 0 3px rgb(26, 26, 26, 0);
        transition: all 0.5s ease-in-out;
    }

    .connecting-gradient {
        color: var(--color-text-1);
    }
</style>