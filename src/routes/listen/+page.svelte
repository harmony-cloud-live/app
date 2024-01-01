<script lang="ts">
    import { BeatDisplay, ChordButtons, ChordDisplay } from '$lib/components';
    import Footer from '$lib/components/Footer.svelte';
    import ClientDisplay from '$lib/components/displays/ClientDisplay.svelte';
    import { setContext } from 'svelte';

    setContext('isListener', true);
</script>

<section>
    <ChordDisplay />
    <BeatDisplay />
    <ChordButtons />
    <footer>
        <Footer />
    </footer>
</section>

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
