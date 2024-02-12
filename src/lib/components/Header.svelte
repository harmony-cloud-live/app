<script>
    import {
        LeaderDisplay,
        ChordCollectionDisplay,
        ClientDisplay
    } from '$lib/components';
</script>

<header>
    <div>
        <ChordCollectionDisplay />
    </div>
    <LeaderDisplay />
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
