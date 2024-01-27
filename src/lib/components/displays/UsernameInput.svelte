<script lang="ts">
    import { CancelIcon, ChevronRightIcon } from '$lib/icons';
    import { controlSocket } from '$lib/ws';
    import { fly } from 'svelte/transition';

    export let submitted = false;

    let username = '';
    let usernameError = false;

    const handleSubmit = () => {
        username = username.trim();
        if (username) {
            $controlSocket.setUsername(username);
            usernameError = false;
            submitted = true;
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
        padding: .6em;
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
        height: .75em;
        padding: 1.1em;
        background-color: white;
        border-radius: 1.15em;
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
        border-radius: 1.15em;
        padding: .8em;
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
        height: 1.25em;
        width: 1.25em;
    }
</style>
