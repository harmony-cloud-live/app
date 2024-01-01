import { get, writable } from 'svelte/store';
import { marshalControlEvent, unmarshalControlEvent } from './encoding';
import { controlSocket, initializeUserId } from '.';
import type { Chord, Client, Settings } from '$lib/types';
import { clients, currentBeat, currentIndex, isLeader, leaderUsername, mainSequence } from '$lib/stores';
import { goto } from '$app/navigation';

export type ControlSocket = WebSocket & { 
    newIndex: (index: number) => void,
    newBeat: (beat: number) => void,
    newMainSequence: () => void,
    newLeader: (id: string) => void,
    getIndex: () => void, 
    getBeat: () => void,
    getMainSequence: () => void,
    getLeader: () => void,
    setUsername: (username: string) => void,
    getClients: () => void,
}; 

export enum ControlEventType {
    GET_INDEX = 0,
    NEW_INDEX = 1,
    GET_BEAT = 2,
    NEW_BEAT = 3,
    GET_MAIN_SEQUENCE = 4,
    NEW_MAIN_SEQUENCE = 5,
    GET_SETTINGS = 6,
    NEW_SETTINGS = 7,
    GET_LEADER = 8,
    NEW_LEADER = 9,
    SET_USERNAME = 10,
    GET_CLIENTS = 11,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ControlPayload = number | string | Chord[] | Client[] | Settings | null;

export type ControlEvent = {
    type: ControlEventType,
    payload: ControlPayload,
}

export const controlSocketReady = writable(false);

export const initControlSocket = (baseUrl: string) => {
    console.log('initializing control socket...', baseUrl);
    const userId = initializeUserId();
    const username = localStorage.getItem('hc-username') || '';
    const url = `${baseUrl}?userId=${userId}`;
    console.log('control socket url', url);
    
    let ws: WebSocket;
    try {
        ws = new WebSocket(url);
    } catch (e) {
        console.log('error creating control socket', e);
        return;
    }
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        if (ws.readyState === WebSocket.OPEN) {
            controlSocketReady.set(true);
            console.log('web control ready', ws);
            const cs = get(controlSocket);
            cs.setUsername(username);
            cs.getLeader();
            cs.getMainSequence();
        }
    }

    ws.onclose = () => {
        if (ws.readyState === WebSocket.CLOSED) {
            controlSocketReady.set(false);
        }
        setTimeout(() => {
            console.log('reconnecting control socket...');
            controlSocket.set(<ControlSocket>initControlSocket(baseUrl));
        }, 1000);
    }

    ws.onmessage = (event) => {
        const data = unmarshalControlEvent(event.data);
        if (!data) return;

        switch (data.type) {
            case ControlEventType.NEW_INDEX:
                if (typeof data.payload === 'number')
                    currentIndex.set(data.payload);
                break;
            case ControlEventType.NEW_MAIN_SEQUENCE:
                console.log('new main sequence');
                if (Array.isArray(data.payload))
                    mainSequence.set(data.payload as Chord[]);
                break;
            case ControlEventType.NEW_BEAT:
                console.log('received beat', data.payload)
                if (typeof data.payload === 'number')
                    currentBeat.set(data.payload);
                break;
            case ControlEventType.NEW_LEADER:
            case ControlEventType.GET_LEADER:
                console.log('received leader', data.payload)
                if (typeof data.payload === 'string') {
                    const [_leaderId, _leaderUsername] = data.payload.split('|');
                    if (_leaderId === userId) {
                        console.log('I am leader');
                        isLeader.set(true);
                        leaderUsername.set(_leaderUsername);
                        goto('/play');
                    } else {
                        console.log('Not leader');
                        isLeader.set(false);
                        leaderUsername.set(_leaderUsername);
                    }
                }
                break;
            case ControlEventType.GET_CLIENTS:
                console.log('received clients', data.payload);
                clients.set(data.payload as Client[]);
                break;
            default:
                console.log('unknown control event type', data.type)
                break;
        }
    }

    const getClients = () => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.GET_CLIENTS, null));
    }

    
    const setUsername = (username: string) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.SET_USERNAME, username ?? localStorage.getItem('hc-username')));
    }


    const newIndex = (index: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.NEW_INDEX, index));
    }

    const getIndex = () => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('requesting index...')
            ws.send(marshalControlEvent(ControlEventType.GET_INDEX, null));
        }
    }

    const newBeat = (beat: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.NEW_BEAT, beat));
    }

    const getBeat = () => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('requesting beat...')
            ws.send(marshalControlEvent(ControlEventType.GET_BEAT, null));
        }
    }

    const newMainSequence = () => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('requesting main sequence...');
            ws.send(marshalControlEvent(ControlEventType.NEW_MAIN_SEQUENCE, null));
        }
    }

    const getMainSequence = () => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('requesting main sequence...');
            ws.send(marshalControlEvent(ControlEventType.GET_MAIN_SEQUENCE, null));
        }
    }

    const getLeader = () => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('requesting leader...');
            ws.send(marshalControlEvent(ControlEventType.GET_LEADER, null));
        }
    }

    const newLeader = (id: string) => {
        if (ws.readyState === WebSocket.OPEN) {
            console.log('requesting new leader...');
            ws.send(marshalControlEvent(ControlEventType.NEW_LEADER, id));
        }
    }

    return { 
        ...ws,
        getIndex,
        newIndex,
        getBeat,
        newBeat,
        getMainSequence,
        newMainSequence,
        getLeader,
        newLeader,
        setUsername,
        getClients,
    };
}

