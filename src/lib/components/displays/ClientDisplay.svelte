<script lang='ts'>
    import { clients, controlSocket, isLeader, leaderUsername } from '$lib/stores';
    import { getContext } from 'svelte';
    import { flip } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';

    $: isListener = !$isLeader && getContext('isListener');
    $: expandedId = '';

    isLeader.subscribe(() => {
        expandedId = '';
    })

    const handlePointerUp = (event: PointerEvent) => {
        if (event.target instanceof HTMLButtonElement || 
            event.target instanceof HTMLSpanElement) return;
        expandedId = '';
    }

    const handleClick = (id: string) => {
        if (!$isLeader) return;
        if (expandedId !== id) {
            expandedId = id
            return;
        }
        $controlSocket.newLeader(id);
    }
</script>

<svelte:window on:pointerup={handlePointerUp} />

<div class="container" class:isListener>
    {#each $clients as client (client.userId)}
        <button class="client" 
            animate:flip={{ duration: 150, easing: cubicOut }}
            class:expanded={expandedId === client.userId && client.username !== $leaderUsername}
            class:isLeader={client.username === $leaderUsername} 
            on:pointerdown={() => handleClick(client.userId)}
        >
            {#if expandedId === client.userId && client.username !== $leaderUsername}
                <span class="client-name">promote {client.username}?</span>
            {:else}
                <span class="client-name">{client.username}</span>
            {/if}
        </button>
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

    .isListener {
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
    
    .client {
        position: relative;
        background-color: var(--color-text-2);
        padding: 1.5em;
        font-size: 1.25em;
        font-weight: 700;
        border-radius: 4em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transition: all 0.1s ease-in-out;
        &.expanded {
            outline: .2em solid var(--color-text);
        }
    }
</style>
