<script>
    import './styles.css';
    import * as Tone from 'tone';
    import { initPlaybackLoop, playbackLoop, stopPlayback } from '$lib/tone';
    import { isReady, tempo, timeSignature } from '$lib/stores';
    import { Header, Footer, WelcomeModal } from '$lib/components';
    import { onDestroy } from 'svelte';

    const unsubscribeTempo = tempo.subscribe(t => Tone.Transport.bpm.value = t);
    
    const unsubscribeTimeSignature = timeSignature.subscribe((ts) => {
        Tone.Transport.timeSignature = [ts.upper, ts.lower];
        if (Tone.Transport.state === 'started') {
            stopPlayback();
        }
        $playbackLoop = initPlaybackLoop();
    });

    onDestroy(() => {
        unsubscribeTempo();
        unsubscribeTimeSignature();
    });
</script>

<svelte:head>
    <title>Harmony Cloud</title>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
</svelte:head>

{#if !$isReady}
    <WelcomeModal />
{/if}

<div class="app">
    <Header />
    <main>
        <slot />
    </main>
    <Footer />
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 97vh;
    }

    main {
        padding: 1rem 0;
        width: 100%;
        margin: 0 auto;
    }

</style>
