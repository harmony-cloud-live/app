<script lang='ts'>
    import {
        TempoControl,
        SustainPedal,
        SliderWrapper,
    } from '$lib/components';
    import { velocity, noteDelay, isLeader } from '$lib/stores';
    import { controlSocket } from '$lib/ws';
    import { cubicInOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';

    const setNoteDelay = (e: CustomEvent<number>) => {
        $controlSocket.setNoteDelay(e.detail);
    };

    const setVelocity = (e: CustomEvent<number>) => {
        $controlSocket.setVelocity(e.detail);
    };
</script>


{#if $isLeader}
    <footer transition:fly={{y: 50, duration: 150, easing: cubicInOut}}>
        <TempoControl />
        <SliderWrapper title="ARP" onChange={setNoteDelay} initialValue={$noteDelay} />
        <SliderWrapper title="VOL" onChange={setVelocity} initialValue={$velocity} />
        <SustainPedal />
    </footer>
{/if}

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