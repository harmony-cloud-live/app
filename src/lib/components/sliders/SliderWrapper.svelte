<script lang="ts">
    import Slider from "./Slider.svelte";
    
    export let title = "";
    export let initialValue = 0;
    export let min = 0;
    export let max = 100;
    export let onChange: (e: CustomEvent<number>) => void;
</script>

<div class="container">
    {title}
    <Slider on:change={onChange} min={min} max={max} initialValue={initialValue} id="delay"/>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: .5em;
        width: 15em;
        padding: 2rem;
        font-size: 1.5em;
        font-weight: 700;
    }
</style>