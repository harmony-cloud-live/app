<script>
    import { isReady, settings } from '$lib/stores';
    import { Header, WelcomeModal } from '$lib/components';

    import './styles.css';
    import { onDestroy } from 'svelte';
    import * as Tone from 'tone';

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</svelte:head>

{#if !$isReady}
    <WelcomeModal />
{/if}

<div class="app">
    <Header />

    <main>
        <slot />
    </main>

</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 97vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }

</style>
