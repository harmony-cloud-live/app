<script lang='ts'>
    import { BeatDisplay, ChordButtons, ChordDisplay, Footer, LeaderModal, Player } from '$lib/components';
    import { isLeader, isReady } from '$lib/stores';
    import { controlSocket } from '$lib/ws';
    import { onMount, setContext } from 'svelte';

    setContext('isListener', false);
    onMount(() => {
        $controlSocket.setUsername(localStorage.getItem('hc-username') || '');
        $controlSocket.getLeader();
        $controlSocket.getMainSequence();
        $controlSocket.getIndex();
        $controlSocket.getBeat();
        console.log('mounting play page');
    });
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