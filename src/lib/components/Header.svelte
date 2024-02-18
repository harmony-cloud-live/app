<script>
    import {
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
    <ToggleAI />
    <div>
        <ClientDisplay />
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: .75em 0 .5em .75em;
        height: 4.1em;
    }
</style>
