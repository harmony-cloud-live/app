<script lang='ts'>
    import { BeatDisplay, ChordButtons, ChordDisplay, Footer, LeaderModal, Player } from '$lib/components';
    import { isLeader, isReady } from '$lib/stores';
    import { setContext } from 'svelte';

    setContext('isListener', false);
</script>

{#if $isReady && !$isLeader}
    <LeaderModal />
{/if}

<section>
    <ChordDisplay />
    <Player />
    <BeatDisplay />
    <ChordButtons />
</section>

<footer>
    <Footer />
</footer>

<style>
    footer {
        position: fixed;
        box-sizing: border-box;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 2rem;
        margin: 0 auto;
        font-size: .9em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }
</style>