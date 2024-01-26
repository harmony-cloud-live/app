<script lang='ts'>
    import { controlSocket, midiSocketReady } from "$lib/ws";
    import { cubicOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import StatusIndicatorButton from "../displays/StatusIndicatorButton.svelte";
    import UsernameInput from "../displays/UsernameInput.svelte";

    let username: string;
    let submitted: boolean;

    onMount(() => {
        let userId = localStorage.getItem("hc-userId");
        if (!userId) {
            userId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem("hc-userId", userId);
        }

        $controlSocket.getLeader();
    });
</script>

<div class="modal-background" out:fade={{ duration: 150, easing: cubicOut }}>
    <div class="modal">
        <h1>harmony cloud</h1>
        <div class="user-info" class:submitted>
            <UsernameInput bind:username bind:submitted />
            {#if submitted}
                <StatusIndicatorButton />
            {/if}
        </div>
    </div>
</div>

<style>
    .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 1em;
        background-color: var(--color-text-2);
        outline: .25em solid var(--color-text-2);
        padding: 0;
        border-radius: 1.5em;
        margin: .5em;
        font-size: 2em;
    }
    
    .submitted {
        font-size: 1em;
    }

    h1 {
        font-weight: 700;
        font-size: 5em;
        margin: 0;
    }
    .modal-background {
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        height: 100%;
        backdrop-filter: blur(15px) brightness(0.75);
        -webkit-backdrop-filter: blur(15px) brightness(0.75);
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
    }
</style>
