<script lang="ts">
    import { CancelIcon, ChevronRightIcon } from '$lib/icons';
    import { myUsername } from '$lib/stores';
    import { controlSocket } from '$lib/ws';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    export let username = localStorage.getItem('hc-username') || '';
    export let submitted = username.length > 0;

    let usernameError = false;

    onMount(() => {
        if (username.length) {
            console.log('onmount username', username)
            $controlSocket.setUsername(username);
            $myUsername = username;
        }
    }); 

    const handleSubmit = () => {
        username = username.trim();
        if (username.length) {
            usernameError = false;
            submitted = true;
            $controlSocket.setUsername(username);
            $myUsername = username;
            localStorage.setItem("hc-username", username);
        } else {
            usernameError = true;
        }
    }
    
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && event.target) {
            (event.target as HTMLInputElement).blur();
            handleSubmit();
        }
    }
</script>

<div class='container'>
    {#if !submitted || !username.length}
        <input type='text' 
            in:fly
            class:usernameError
            placeholder='enter your name...' 
            on:focus={() => username = ''}
            on:keydown={handleKeyDown}
            bind:value={username} 
        />

        <button in:fly type='submit' class='submit blue-gradient' on:pointerdown={handleSubmit}>
            <img in:fly src={ChevronRightIcon} alt='submit' />
        </button>
    {:else}
        <button class='edit' on:pointerdown={() => submitted = false}>
            <img src={CancelIcon} alt='edit' />
        </button>
        <span>{username}</span> 
    {/if}
</div>

<style>
    span {
        font-size: 1.25em;
    }

    .usernameError {
        outline: .15em solid red;
    }

    .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 2.5em;
        border: 0 transparent;
        padding: 0.6em 1em .6em .75em;
        font-weight: 700;
        text-transform: uppercase;
        text-decoration: none;
        gap: .75em;
        color: var(--color-text-1);
        cursor: pointer;
        background-color: var(--color);
        transition: all 0.1s ease-in-out;
    }

    input[type='text'] {
        border: 0;
        height: 2em;
        padding: 1em 1.5em;
        background-color: white;
        border-radius: 1.5em;
    }

    button.edit {
        border-radius: 1.5em;
        padding: .5em;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: .15em transparent; 
        background: var(--color-text);
    }

    .edit img {
        object-fit: contain;
        height: .75em;
        width: .75em;
    }

    button.submit {
        border-radius: 1.5em;
        padding: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: .15em transparent; 
    }

    button.submit:active {
        outline: .15em solid; 
    }

    .submit img {
        object-fit: contain;
        height: 2em;
        width: 2em;
    }
</style>
