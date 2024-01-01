<script lang="ts">
    import { BeatDisplay, ChordButtons, ChordDisplay } from '$lib/components';
    import ClientDisplay from '$lib/components/displays/ClientDisplay.svelte';
    import { setContext } from 'svelte';

    setContext('isListener', true);
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
