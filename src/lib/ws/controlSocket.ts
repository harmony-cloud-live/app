import { get, writable } from 'svelte/store';
import { marshalControlEvent, unmarshalControlEvent } from './encoding';
import { controlSocket, myUserId, myUsername } from '.';
import type { Chord, Client, TimeSignature } from '$lib/types';
import {
    clients,
    currentBeat,
    currentIndex,
    isLeader,
    isLoadingMainSequence,
    isPlaying,
    isSustaining,
    leaderId,
    loopEnd,
    loopStart,
    mainSequence,
    songName,
    timeSignature
} from '$lib/stores';

export type ControlSocket = WebSocket & { 
    newIndex: (index: number) => void,
    newBeat: (beat: number) => void,
    newMainSequence: (songName: string) => void,
    newLeader: (id: string) => void,
    newTimeSignature: (timeSignature: TimeSignature) => void,
    newLoop: (loopStart: number, loopEnd: number) => void,
    getIndex: () => void, 
    getBeat: () => void,
    getMainSequence: () => void,
    getLeader: () => void,
    setUsername: (username: string) => void,
    getClients: () => void,
    getTimeSignature: () => void,
    getLoop: () => void,
    getSongName: () => void,
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
    GET_TIME_SIGNATURE = 12,
    NEW_TIME_SIGNATURE = 13,
    GET_LOOP = 14,
    NEW_LOOP = 15,
}

export type ControlPayload = {
    index?: number,
    beat?: number,
    chords?: Chord[],
    timeSignature?: TimeSignature,
    leaderId?: string,
    username?: string,
    clients?: Client[],
    songName?: string;
    loopStart?: number;
    loopEnd?: number;
}

export type ControlEvent = {
    type: ControlEventType,
    payload: ControlPayload,
}

export const controlSocketReady = writable(false);

export const initControlSocket = (baseUrl: string) => {
    console.log('initializing control socket...', baseUrl);
    const userId = get(myUserId);
    const username = get(myUsername);
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
            console.log('control socket ready', ws);

            const cs = get(controlSocket);
            if (username) cs.setUsername(username);
            cs.getLeader();
            cs.getClients();
            cs.getMainSequence();
            cs.getIndex();
            cs.getBeat();
            cs.getTimeSignature();
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
    
    ws.onerror = (event) => {
        console.log('control socket error', event);
    }

    ws.onmessage = (event) => {
        const data = unmarshalControlEvent(event.data);
        if (!data) return;

        switch (data.type) {
            case ControlEventType.NEW_INDEX:
                if (data.payload.index !== undefined)
                    currentIndex.set(data.payload.index);
                break;
            case ControlEventType.NEW_MAIN_SEQUENCE:
                console.log('new main sequence', data.payload.chords);
                if (Array.isArray(data.payload.chords) && data.payload.chords.length > 0) {
                    mainSequence.set(data.payload.chords.map(c => c.chordSymbol));
                    isLoadingMainSequence.set(false);
                }
                if (data.payload.songName !== undefined) {
                    songName.set(data.payload.songName);
                }
                break;
            case ControlEventType.NEW_BEAT:
                if (data.payload.beat !== undefined)
                    currentBeat.set(data.payload.beat);
                break;
            case ControlEventType.NEW_TIME_SIGNATURE:
                console.log('received time signature', data.payload.timeSignature as TimeSignature)
                if (data.payload.timeSignature !== undefined) {
                    timeSignature.set(data.payload.timeSignature as TimeSignature);
                }
                break;
            case ControlEventType.NEW_LEADER:
            case ControlEventType.GET_LEADER:
                if (data.payload.leaderId !== undefined) {
                    if (data.payload.leaderId === userId) {
                        isLeader.set(true);
                        leaderId.set(data.payload.leaderId);
                    } else {
                        isLeader.set(false);
                        leaderId.set(data.payload.leaderId);
                        isPlaying.set(false);
                        isSustaining.set(true);
                    }
                }
                break;
            case ControlEventType.GET_CLIENTS:
                if (Array.isArray(data.payload.clients)) {
                    const sortedClients = (data.payload.clients as Client[]).sort((a, b) => a.username.localeCompare(b.username));
                    clients.set(sortedClients);
                }
                break;
            case ControlEventType.NEW_LOOP:
                if (data.payload.loopStart !== undefined && data.payload.loopEnd !== undefined) {
                    loopStart.set(data.payload.loopStart);
                    loopEnd.set(data.payload.loopEnd);
                }
                break;
            default:
                console.log('unknown control event type', data.type)
                break;
        }
    }

    const getClients = () => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.GET_CLIENTS, {}));
    }

    
    const setUsername = (username: string) => {
        if (username) {
            myUsername.set(username);
            localStorage.setItem("hc-username", username);

            if (ws.readyState === WebSocket.OPEN)
                ws.send(marshalControlEvent(ControlEventType.SET_USERNAME, {username}));
        }
    }

    const newIndex = (index: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.NEW_INDEX, {index}));
    }

    const getIndex = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_INDEX, {}));
        }
    }

    const newBeat = (beat: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.NEW_BEAT, {beat}));
    }

    const getBeat = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_BEAT, {}));
        }
    }
    
    const newTimeSignature = (timeSignature: TimeSignature) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader))
            ws.send(marshalControlEvent(ControlEventType.NEW_TIME_SIGNATURE, {timeSignature}));
    }

    const getTimeSignature = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_TIME_SIGNATURE, {}));
        }
    }

    const newMainSequence = (songName: string) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.NEW_MAIN_SEQUENCE, {songName}));
            isLoadingMainSequence.set(true);
        }
    }

    const getMainSequence = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_MAIN_SEQUENCE, {}));
        }
    }

    const getLeader = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_LEADER, {}));
        }
    }

    const newLeader = (leaderId: string) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.NEW_LEADER, {leaderId}));
        }
    }
    
    const getLoop = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_LOOP, {}));
        }
    }

    const newLoop = (loopStart: number, loopEnd: number) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.NEW_LOOP, {loopStart, loopEnd}));
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
        getTimeSignature,
        newTimeSignature,
        getLoop,
        newLoop,
    };
}

