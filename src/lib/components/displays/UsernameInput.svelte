<script lang="ts">
    import { CancelIcon, ChevronRightIcon, ListenIcon } from '$lib/icons';
    import { initTone } from '$lib/tone';
    import { controlSocket, myUsername } from '$lib/ws';
    import { fly } from 'svelte/transition';
    import { listenOnly } from '$lib/stores';

    let username = $myUsername;
    let usernameError = false;
    export let submitted = username.length > 0;

    const handleSubmit = () => {
        if ($listenOnly) return;
        username = username.trim();
        if (username) {
            $controlSocket.setUsername(username);
            usernameError = false;
            submitted = true;
        } else {
            usernameError = true;
        }
    }
    
    const listen = async () => {
        $listenOnly = true;
        await initTone();
        $controlSocket.setUsername("");
        $controlSocket.getLeader();
        $controlSocket.getMainSequence();
        $controlSocket.getIndex();
        $controlSocket.getBeat();
        $controlSocket.getClients();
        $controlSocket.getTimeSignature();
        $controlSocket.getNoteDelay();
        $controlSocket.getVelocity();
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
        <button in:fly class='listen blue-gradient' on:pointerdown={listen}>
            <img in:fly src={ListenIcon} alt='submit' />
        </button>
        <input type='text'
            in:fly
            class:usernameError
            placeholder='enter your name...'
            on:focus={() => username = ''}
            on:keydown={handleKeyDown}
            bind:value={username}
        />

        <button in:fly type='submit' class='submit green-gradient' on:pointerdown={handleSubmit}>
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

    button.submit, button.listen {
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

    .listen img {
        margin-top: -.1em;
        height: 1.45em;
        width: 1.45em;
    }
</style>
