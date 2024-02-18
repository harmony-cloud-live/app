<script lang="ts">
    import { clients, controlSocket, isLeader, leaderId, listenOnly } from "$lib/stores";
    import { myUsername } from "$lib/ws";
    import { cubicInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    $: leaderUsername = $clients.find(c => c.userId === $leaderId)?.username;
    $: isExpanded = leaderUsername === undefined;

    isLeader.subscribe(() => {
        isExpanded = leaderUsername === undefined;
    })

    const handleClick = () => {
        if ($isLeader) return;
        if (!isExpanded) {
            isExpanded = true;
            return;
        }
        if (!$listenOnly && $myUsername.length > 0) {
            $controlSocket.newLeader(localStorage.getItem('hc-userId') || '')
        } else {
            window.location.reload()
        }
    }

    const handlePointerUp = (event: PointerEvent) => {
        if (event.target instanceof HTMLButtonElement || 
            event.target instanceof HTMLSpanElement) return;
        isExpanded = leaderUsername === undefined;
    }
</script>

<svelte:window on:pointerup={handlePointerUp} />

<div class="container fixed-center" class:isExpanded 
    transition:fly={{ y: 100, duration: 250, easing: cubicInOut }}>
    <button class="leader" on:click={handleClick}>
        {#if isExpanded}
            {#if !$listenOnly && $myUsername.length > 0}
                <span class="bold">take lead?</span>
            {:else}
                <span class="bold">set username to play</span>
            {/if}
        {:else}
            <span><span class="bold">{leaderUsername}</span> is lead</span>
        {/if}
    </button>
</div>

<style>
    .container {
        padding: .2em;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4.5em;
        border: .2em;
        border-radius: 2.5em;
        background: #1a1a1a;
        transition: width 5s ease-in-out;
        margin-top: -9em;
    }

    button.leader {
        font-size: 1.7em;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        background-color: #1a1a1a;
        border-radius: inherit;
        height: inherit;
        border: inherit;
        transition: width 5s ease-in-out;
    }

    .isExpanded {
        background: linear-gradient(70deg, #00d2ff 0%, #3a47d5 100%);
    }

    .bold {
        font-weight: 700;
        letter-spacing: 0.07em;
    }

</style>