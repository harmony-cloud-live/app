<script lang="ts">
    import { BeatDisplay, ChordButtons, ChordDisplay } from '$lib/components';
    import ClientDisplay from '$lib/components/displays/ClientDisplay.svelte';
    import { controlSocket } from '$lib/ws';
    import { onMount, setContext } from 'svelte';

    setContext('isListener', true);
    onMount(() => {
        $controlSocket.setUsername(localStorage.getItem('hc-username') || '');
        $controlSocket.getLeader();
        $controlSocket.getMainSequence();
        $controlSocket.getIndex();
        $controlSocket.getBeat();
        console.log('mounting play page');
    });
</script>

<section>
    <ChordDisplay />
    <BeatDisplay />
    <ChordButtons />
    <footer>
        <ClientDisplay />
    </footer>
</section>

<style>
    footer {
        position: fixed;
        bottom: 2em;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        overflow: hidden;
    }
</style>
