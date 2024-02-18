<script lang="ts">
    import {
        ChordButtons,
        ChordDisplay,
        Player,
        ManualButtons,
        ManualPlayer,
    } from "$lib/components";

    import { aiMode, isLeader } from "$lib/stores";
    import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    let flash = false;

    const unsub = isLeader.subscribe((val) => {
        if (val) {
            flash = true;
            setTimeout(() => {
                flash = false;
            }, 1000);
        }
    });

    onMount(() => {
        return () => {
            unsub();
        };
    });
</script>

{#if $aiMode}
    <section transition:fly={{ x: -2500, duration: 300, easing: cubicInOut }}>
        <ChordDisplay />
        <ChordButtons />
        <Player />
    </section>
{:else}
    <section transition:fly={{ x: 2500, duration: 300, easing: cubicInOut }}>
        <ManualButtons />
        <ManualPlayer />
    </section>
{/if}


{#if flash}
    <div class="flash"></div>
{/if} 

<style>
    section {
        position: absolute;
    }

    .flash {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: white;
        animation: flashAnimation 1s forwards;
    }

    @keyframes flashAnimation {
        from {
            opacity: .2;
        }
        to {
            opacity: 0;
        }
    }
</style>
