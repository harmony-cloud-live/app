<script lang='ts'>
    import {
        TempoControl,
        SustainPedal,
        ClientDisplay,
    } from '$lib/components';
</script>

<footer>
    <TempoControl />
    <ClientDisplay />
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