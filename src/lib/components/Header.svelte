<script>
    import {
        LeaderDisplay,
        ToggleAI,
        ChordCollectionDisplay,
        ClientDisplay
    } from '$lib/components';
    import { isLeader } from '$lib/stores';
</script>

<header>
    <div>
        <ChordCollectionDisplay />
    </div>
    {#if $isLeader}
        <ToggleAI />
    {:else}
        <LeaderDisplay />
    {/if}
    <div>
        <ClientDisplay />
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .75em;
        height: 4.25em;
    }
</style>
