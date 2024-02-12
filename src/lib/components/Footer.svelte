<script lang='ts'>
    import {
        TempoControl,
        SustainPedal,
        SliderWrapper,
    } from '$lib/components';
    import { velocity, noteDelay } from '$lib/stores';
    import { controlSocket } from '$lib/ws';

    const setNoteDelay = (e: CustomEvent<number>) => {
        $controlSocket.setNoteDelay(e.detail);
    };

    const setVelocity = (e: CustomEvent<number>) => {
        $controlSocket.setVelocity(e.detail);
    };
</script>


<footer>
    <TempoControl />
    <SliderWrapper title="ARP" onChange={setNoteDelay} initialValue={$noteDelay} />
    <SliderWrapper title="VOL" onChange={setVelocity} initialValue={$velocity} />
    <SustainPedal />
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