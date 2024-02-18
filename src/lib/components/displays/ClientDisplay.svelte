<script lang='ts'>
    import { clients, controlSocket, isLeader, leaderId } from '$lib/stores';
    import { flip } from 'svelte/animate';
    import { cubicOut } from 'svelte/easing';

    $: inactive = !$isLeader;
    $: expandedId = '';
    
    const scrollToItem = (id: string) => {
        const element = document.getElementById(id);
        if (element)
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

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

    isLeader.subscribe(() => expandedId = '');
    leaderId.subscribe(id => scrollToItem(id));
</script>

<svelte:window on:pointerup={handlePointerUp} />

<div class="container" class:inactive>
    {#each $clients as client (client.userId)}
    <div class="client-wrapper" 
        id={client.userId}
        class:expanded={expandedId === client.userId && client.userId !== $leaderId}
        animate:flip={{ duration: 150, easing: cubicOut }}>
        <button class="client" 
            class:isLeader={client.userId === $leaderId} 
            on:click={() => handleClick(client.userId)}
        >
            {#if expandedId === client.userId && client.userId !== $leaderId}
                <span class="client-name">promote {client.username}</span>
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
        flex-direction: row-reverse;
        gap: .2em;
        width: 44vw;
        padding: .25em .5em 0 3em;
        overflow: scroll;
        -webkit-mask-image: linear-gradient(to left, transparent, black 0%, black 92%, transparent);
        mask-image: linear-gradient(to left, transparent, black 0%, black 92%, transparent);
    }

    .client-wrapper {
        border-radius: 4em;
        padding: .23em;
    }
    
    .client {
        position: relative;
        padding: 1.25em;
        font-size: 1em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        border-radius: inherit;
        height: inherit;
        border: inherit;
        transition: all 0.1s ease-in-out;
        background: #1a1a1a;
        white-space: nowrap;
    }

    .expanded {
        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%, #cc2366 75%, #bc1888 100%);
    }
</style>
