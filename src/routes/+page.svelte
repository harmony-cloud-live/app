<script lang='ts'>
    import {
        ChordButtons,
        ChordDisplay,
        Player,
        ManualButtons
    } from '$lib/components';
    import { aiMode } from '$lib/stores';
</script>

<section>
    {#if $aiMode}
        <ChordDisplay />
        <ChordButtons />
        <Player />
    {:else}
        <ManualButtons />
    {/if}
</section>
