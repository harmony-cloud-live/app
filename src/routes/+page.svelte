<script lang='ts'>
    import {
        ChordButtons,
        ChordDisplay,
        Player,
        ManualButtons,
        ManualPlayer
    } from '$lib/components';
    import { aiMode } from '$lib/stores';
    import { cubicInOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';
</script>

{#if $aiMode}
    <section transition:fly={{x: -2500, duration: 300, easing: cubicInOut}}>
        <ChordDisplay />
        <ChordButtons />
        <Player />
    </section>
{:else}
    <section transition:fly={{x: 2500, duration: 300, easing: cubicInOut}}>
        <ManualButtons />
        <ManualPlayer />
    </section>
{/if}

<style>
    section {
        position: absolute;
    }
</style>
