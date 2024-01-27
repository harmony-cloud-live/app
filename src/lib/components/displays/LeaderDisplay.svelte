<script lang="ts">
    import { clients, controlSocket, isLeader, leaderId } from "$lib/stores";
    import { cubicInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    $: isExpanded = false;
    $: leaderUsername = $clients.find(c => c.userId === $leaderId)?.username;

    isLeader.subscribe(() => {
        isExpanded = false;
    })

    const handleClick = () => {
        if ($isLeader) return;
        if (!isExpanded) {
            isExpanded = true;
            return;
        }
        $controlSocket.newLeader(localStorage.getItem('hc-userId') || '')
    }

    const handlePointerUp = (event: PointerEvent) => {
        if (event.target instanceof HTMLButtonElement || 
            event.target instanceof HTMLSpanElement) return;
        isExpanded = false;
    }
</script>

<svelte:window on:pointerup={handlePointerUp} />

{#if !$isLeader}
    <div class="container fixed-center" class:isExpanded 
        transition:fly={{ y: -100, duration: 250, easing: cubicInOut }}>
        <button class="leader" on:click={handleClick}>
            {#if isExpanded}
                <span class="bold">take lead?</span>
            {:else}
                <span><span class="bold">{leaderUsername ?? "no one"}</span> is lead</span>
            {/if}
        </button>
    </div>
{/if}

<style>
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
        font-size: 1.25em;
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
    }

</style>