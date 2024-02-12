<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    // Props
    export let min = 0;
    export let max = 100;
    export let initialValue = 0;
    export let id: string;
    export let value =
        typeof initialValue === "string"
            ? parseInt(initialValue)
            : initialValue;

    // Node Bindings
    let container: HTMLElement;
    let thumb: HTMLElement;
    let progressBar: HTMLElement;
    let element: HTMLElement;

    // Internal State
    let elementX: number;
    let currentThumb: HTMLElement | null = null;
    let holding = false;
    let thumbHover = false;

    // Mouse shield used onMouseDown to prevent any mouse events penetrating other elements,
    // ie. hover events on other elements while dragging. Especially for Safari
    const mouseEventShield = document.createElement("div");
    mouseEventShield.setAttribute("class", "mouse-over-shield");
    mouseEventShield.addEventListener("mouseover", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    function resizeWindow() {
        elementX = element.getBoundingClientRect().left;
    }

    function onTrackEvent(e: MouseEvent | TouchEvent) {
        // Update value immediately before beginning drag
        updateValueOnEvent(e);
        onDragStart(e);
    }

    function onDragStart(e: MouseEvent | TouchEvent) {
        // If mouse event add a pointer events shield
        if (e.type === "mousedown") document.body.append(mouseEventShield);
        currentThumb = thumb;
    }

    function onDragEnd(e: MouseEvent | TouchEvent) {
        // If using mouse - remove pointer event shield
        if (e.type === "mouseup") {
            if (document.body.contains(mouseEventShield))
                document.body.removeChild(mouseEventShield);
            // Needed to check whether thumb and mouse overlap after shield removed
            if (isMouseInElement(e as MouseEvent, thumb)) thumbHover = true;
        }
        currentThumb = null;
        dispatch("change", value);
    }

    // Check if mouse event cords overlay with an element's area
    function isMouseInElement(event: MouseEvent, element: HTMLElement) {
        let rect = element.getBoundingClientRect();
        let { clientX: x, clientY: y } = event;
        if (x < rect.left || x >= rect.right) return false;
        if (y < rect.top || y >= rect.bottom) return false;
        return true;
    }

    function calculateNewValue(clientX: number) {
        // Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
        let delta = clientX - (elementX + 10);

        // Use width of the container minus (5px * 2 sides) offset for percent calc
        let percent = (delta * 100) / (container.clientWidth - 10);

        // Limit percent 0 -> 100
        percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;

        // Limit value min -> max
        value = Math.round((percent * (max - min)) / 100 + min);
    }

    // Handles both dragging of touch/mouse as well as simple one-off click/touches
    function updateValueOnEvent(e: Event) {
        // touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
        if (!currentThumb && e.type !== "touchstart" && e.type !== "mousedown")
            return false;

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();

        // Get client's x cord either touch or mouse
        const clientX =
            e.type === "touchmove" || e.type === "touchstart"
                ? (e as TouchEvent).touches[0].clientX
                : (e as MouseEvent).clientX;

        calculateNewValue(clientX);
    }

    // React to left position of element relative to window
    $: if (element) elementX = element.getBoundingClientRect().left;

    // Set a class based on if dragging
    $: holding = Boolean(currentThumb);

    // Update progressbar and thumb styles to represent value
    $: if (progressBar && thumb) {
        // Limit value min -> max
        value = value > min ? value : min;
        value = value < max ? value : max;

        let percent = ((value - min) * 100) / (max - min);
        let offsetLeft = (container.clientWidth - 10) * (percent / 100) + 5;

        // Update thumb position + active range track width
        thumb.style.left = `${offsetLeft}px`;
        progressBar.style.width = `${offsetLeft}px`;
    }
</script>

<svelte:window
    on:touchmove|nonpassive={updateValueOnEvent}
    on:touchcancel={onDragEnd}
    on:touchend={onDragEnd}
    on:mousemove={updateValueOnEvent}
    on:mouseup={onDragEnd}
    on:resize={resizeWindow}
/>
<div class="range">
    <div
        class="range__wrapper"
        tabindex="0"
        bind:this={element}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        {id}
        on:mousedown={onTrackEvent}
        on:touchstart={onTrackEvent}
    >
        <div class="range__track" bind:this={container}>
            <div
                class="range__track--highlighted orange-gradient"
                bind:this={progressBar}
            />
            <div
                class="range__thumb"
                class:range__thumb--holding={holding}
                bind:this={thumb}
                on:touchstart={onDragStart}
            >
                {#if holding || thumbHover}
                    <div
                        class="range__tooltip"
                        in:fly={{ y: 7, duration: 200 }}
                        out:fade={{ duration: 100 }}
                    >
                        {value}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<svelte:head>
    <style>
        .mouse-over-shield {
            position: fixed;
            top: 0px;
            left: 0px;
            height: 100%;
            width: 100%;
            background-color: rgba(255, 0, 0, 0);
            z-index: 10000;
            cursor: grabbing;
        }
    </style>
</svelte:head>

<style>
    .range {
        position: relative;
        flex: 1;
    }

    .range__wrapper {
        min-width: 100%;
        position: relative;
        padding: 0.5rem;
        box-sizing: border-box;
        outline: none;
    }

    .range__track {
        height: 8px;
        background-color: var(--track-bgcolor, #252525);
        border-radius: 999px;
    }

    .range__track--highlighted {
        width: 0;
        height: 8px;
        position: absolute;
        border-radius: 999px;
    }

    .range__thumb {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: var(--thumb-bgcolor, white);
        cursor: pointer;
        border-radius: 999px;
        margin-top: -11px;
        transition: box-shadow 100ms;
        user-select: none;
        box-shadow: var(
            --thumb-boxshadow,
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 0px 3px 2px rgba(0, 0, 0, 0.2)
        );
    }

    .range__thumb--holding {
        box-shadow:
            0 1px 1px 0 rgba(0, 0, 0, 0.14),
            0 1px 2px 1px rgba(0, 0, 0, 0.2),
            0 0 0 6px var(--thumb-holding-outline, rgba(255, 255, 255, 0.3));
    }

    .range__tooltip {
        pointer-events: none;
        position: absolute;
        top: -42px;
        color: var(--tooltip-text, white);
        width: 44px;
        padding: 4px 0;
        border-radius: 5px;
        text-align: center;
        background: linear-gradient(
            45deg,
            #f09433 0%,
            #e6683c 20%,
            #dc2743 60%,
            #cc2366 75%
        );
        font-size: 1em;
    }

    .range__tooltip::after {
        content: "";
        display: block;
        position: absolute;
        height: 9px;
        width: 9px;
        background: linear-gradient(
            80deg,
            #e6683c 0%,
            #dc2743 100%
        );
        bottom: -4px;
        left: calc(50% - 4px);
        clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
        transform: rotate(-45deg);
        border-radius: 0 0 0 3px;
    }
</style>
