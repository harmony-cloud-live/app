<script lang='ts'>
    import { controlSocket, leaderUsername } from '$lib/stores';
    import { cubicInOut } from 'svelte/easing';
    import { blur } from 'svelte/transition';

    $: hasLeader = !!$leaderUsername;
</script>

<div class="modal-background" transition:blur={{ duration: 250, amount: '2em', easing: cubicInOut }}>
    <div class="modal">
        {#if hasLeader}
            <h1>{$leaderUsername} has lead</h1>
        {:else}
            <h1>no one has lead!</h1>
        {/if}
        <nav>
            <button class="request" on:pointerdown={() => $controlSocket.newLeader(localStorage.getItem('hc-userId') || '')}>
                take lead
            </button>
            <a href="/listen">
                <button class="back">
                    go back
                </button>
            </a>
        </nav>
    </div>
</div>

<style>
    h1 {
        font-size: 2em;
        font-weight: bold;
        text-align: center;
    }
    nav {
        display: flex;
        flex-direction: row;
        gap: 1em;
    }
    button {
        padding: 0.5em 1em;
        border-radius: 1.5em;
        border: none;
        font-size: 1.5em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        color: var(--color-text);
        background-color: rgba(0, 0, 0, 0.25);
    }

    .modal-background {
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        height: 100%;
        backdrop-filter: blur(5px) brightness(0.75);
        -webkit-backdrop-filter: blur(5px) brightness(0.75);
        display: grid;
        place-items: center;
        z-index: 999;
    }

    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1em;
        max-width: 70%;
        max-height: 80%;
        overflow: auto;
        border-radius: 1em;
        background-color: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(7.5px);
        -webkit-backdrop-filter: blur(7.5px);
        padding: 1em 2em;
        box-shadow: 0 0 15px 10px rgba(0, 0, 0, .1);
    }
</style>