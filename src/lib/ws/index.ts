import { writable } from "svelte/store";
import { initMidiSocket, type MidiSocket } from "./midiSocket";
import { initControlSocket, type ControlSocket } from "./controlSocket";

const SOCKET_URL = import.meta.env['VITE_SOCKET_URL'];
const MIDI_SOCKET_URL = `${SOCKET_URL}midi`;
const CONTROL_SOCKET_URL = `${SOCKET_URL}control`;

export const initializeUserId = () => {
    const userId = localStorage.getItem("hc-userId");
    if (!userId) {
        localStorage.setItem(
            "hc-userId",
            `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        );
    }
    return localStorage.getItem("hc-userId");
};

export const controlSocket = writable<ControlSocket>(initControlSocket(CONTROL_SOCKET_URL));
export { controlSocketReady } from './controlSocket';

export const midiSocket = writable<MidiSocket>(initMidiSocket(MIDI_SOCKET_URL));
export { midiSocketReady } from './midiSocket';
