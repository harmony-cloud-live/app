import { writable } from "svelte/store";
import { initMidiSocket } from "./midiSocket";
import { initControlSocket } from "./controlSocket";
import type { ControlSocket, MidiSocket } from "$lib/types";

const SOCKET_URL = `ws://${window.location.hostname}:4000`;
const MIDI_SOCKET_URL = new URL('/midi', SOCKET_URL).toString();
const CONTROL_SOCKET_URL = new URL('/control', SOCKET_URL).toString();

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

export const myUserId = writable(initializeUserId());
export const myUsername = writable(localStorage.getItem('hc-username') || '');

export const controlSocket = writable<ControlSocket>(initControlSocket(CONTROL_SOCKET_URL));
export const controlSocketReady = writable(false);

export const midiSocket = writable<MidiSocket>(initMidiSocket(MIDI_SOCKET_URL));
export const midiSocketReady = writable(false);

