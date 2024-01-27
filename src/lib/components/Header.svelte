<script>
    import {
        LeaderDisplay,
        TimeSignatureDisplay,
        ChordCollectionDisplay
    } from '$lib/components';
</script>

<header>
    <div>
        <ChordCollectionDisplay />
    </div>
    <LeaderDisplay />
    <div>
        <TimeSignatureDisplay />
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        padding: .75em;
        max-height: 4.25em;
    }
</style>
