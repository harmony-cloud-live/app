import { writable } from 'svelte/store';
import { PlaybackEventType, type Chord } from '$lib/types';
import { marshalMidi } from './encoding';
import { initializeUserId, midiSocket } from '.';

export type MidiSocket = WebSocket & { sendStopAll: () => void, sendChordDown: (chord: Chord) => void };

export const midiSocketReady = writable(false);

export const initMidiSocket = (baseUrl: string) => {
    console.log('initializing midi socket...', baseUrl);
    const userId = initializeUserId();
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

    const STOP_ALL = marshalMidi(PlaybackEventType.STOP_ALL, null);
    const sendStopAll = () => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(STOP_ALL);
    }

    const sendChordDown = (chord: Chord) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalMidi(PlaybackEventType.CHORD_DOWN, chord));
    }

    return { 
        ...ws,
        sendStopAll,
        sendChordDown,
    };
}

