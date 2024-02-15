<script>
    import {
        LeaderDisplay,
        ToggleAI,
        ChordCollectionDisplay,
        ClientDisplay
    } from '$lib/components';
</script>

<header>
    <div>
        <ChordCollectionDisplay />
    </div>
    <LeaderDisplay />
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
        padding: .75em;
        height: 4.25em;
    }
</style>
