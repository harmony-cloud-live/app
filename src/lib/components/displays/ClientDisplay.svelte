<script lang='ts'>
    import { clients, controlSocket, isLeader, leaderUsername } from '$lib/stores';
    import { flip } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';

    $: inactive = !$isLeader;
    $: expandedId = '';

    isLeader.subscribe(() => {
        expandedId = '';
    });

    const handlePointerUp = (event: PointerEvent) => {
        if (event.target instanceof HTMLButtonElement || 
            event.target instanceof HTMLSpanElement) return;
        expandedId = '';
    }

    const handleClick = (id: string) => {
        if (!$isLeader) return;
        if (expandedId !== id) {
            expandedId = id;
            return;
        }
        $controlSocket.newLeader(id);
    }
</script>

<svelte:window on:pointerup={handlePointerUp} />

<div class="container" class:inactive>
    {#each $clients as client (client.userId)}
    <div class="client-wrapper" 
        class:expanded={expandedId === client.userId && client.username !== $leaderUsername}
        animate:flip={{ duration: 150, easing: cubicOut }}>
        <button class="client" 
            class:isLeader={client.username === $leaderUsername} 
            on:pointerdown={() => handleClick(client.userId)}
        >
            {#if expandedId === client.userId && client.username !== $leaderUsername}
                <span class="client-name">promote {client.username}?</span>
            {:else}
                <span class="client-name">{client.username}</span>
            {/if}
        </button>
    </div>
    {/each}
</div>

<style>
    .isLeader::before {
        --size: 8px;
        content: '';
        width: 0;
        height: 0;
        top: 0;
        position: absolute;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid #eee;
    }

    .inactive {
        pointer-events: none;
        touch-action: none;
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2em;
        max-width: 80%;
        padding: 1em;
    }

    .client-wrapper {
        border-radius: 4em;
        padding: .23em;
    }
    
    .client {
        position: relative;
        padding: 1.5em;
        font-size: 1.25em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        border-radius: inherit;
        height: inherit;
        border: inherit;
        transition: all 0.1s ease-in-out;
        background: #1a1a1a;
    }

    .expanded {
        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%, #cc2366 75%, #bc1888 100%);
    }
</style>
