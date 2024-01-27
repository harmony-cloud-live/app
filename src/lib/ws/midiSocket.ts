import { get, writable } from 'svelte/store';
import { PlaybackEventType } from '$lib/types';
import { marshalMidi } from './encoding';
import { midiSocket, myUserId } from '.';

export type MidiSocket = WebSocket & {
    sendStopAll: () => void,
    sendChordDown: (index: number) => void,
    sendChordUp: (index: number) => void,
};

export const midiSocketReady = writable(false);

export const initMidiSocket = (baseUrl: string) => {
    console.log('initializing midi socket...', baseUrl);
    const userId = get(myUserId);
    const url = `${baseUrl}?userId=${userId}`;
    let ws: WebSocket;
    try {
        ws = new WebSocket(url);
    } catch (e) {
        console.log('error creating midi socket', e);
        return;
    }

    ws.onopen = () => {
        if (ws.readyState === WebSocket.OPEN) {
            midiSocketReady.set(true);
            console.log('midi socket ready', ws);
        }
    }

    ws.onclose = () => {
        if(ws.readyState === WebSocket.CLOSED) {
            midiSocketReady.set(false);
        }
        setTimeout(() => {
            console.log('reconnecting midi socket...');
            midiSocket.set(<MidiSocket>initMidiSocket(baseUrl));
        }, 1000);
    }

    const sendChordUp = (index: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalMidi(PlaybackEventType.CHORD_UP, index));
    }

    const sendChordDown = (index: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalMidi(PlaybackEventType.CHORD_DOWN, index));
    }

    const sendStopAll = () => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalMidi(PlaybackEventType.STOP_ALL, null));
    }

    return { 
        ...ws,
        sendChordUp,
        sendChordDown,
        sendStopAll,
    };
}

