<script>
    import { controlSocket, isReady, settings } from '$lib/stores';
    import { Header, Footer, WelcomeModal } from '$lib/components';

    import './styles.css';
    import { onDestroy, onMount } from 'svelte';
    import * as Tone from 'tone';

    onMount(() => {
        $controlSocket.setUsername(localStorage.getItem('hc-username') || '');
        $controlSocket.getLeader();
        $controlSocket.getMainSequence();
        $controlSocket.getIndex();
        $controlSocket.getBeat();
    });

    const unsubscribe = settings.subscribe((settings) => {
        Tone.Transport.bpm.value = settings.tempo;
        Tone.Transport.timeSignature = settings.timeSignature;

        console.log('settings changed', settings);
    });

    onDestroy(unsubscribe);
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
