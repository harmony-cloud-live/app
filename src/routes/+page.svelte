<script lang='ts'>
    import {
        ChordButtons,
        ChordDisplay,
        Player,
        ManualButtons
    } from '$lib/components';
    import { aiMode } from '$lib/stores';
    import { cubicInOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';
</script>

{#if $aiMode}
    <section transition:fly={{x: -2500, duration: 400, easing: cubicInOut}}>
        <ChordDisplay />
        <ChordButtons />
        <Player />
    </section>
{:else}
    <section transition:fly={{x: 2500, duration: 400, easing: cubicInOut}}>
        <ManualButtons />
    </section>
{/if}

<style>
    section {
        position: absolute;
    }
</style>
