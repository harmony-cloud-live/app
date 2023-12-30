/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlaybackEventType } from "$lib/types";
import type { ControlEvent, ControlEventType, ControlPayload } from "./controlSocket";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const marshalMidi = (eventType: PlaybackEventType, index: number | null): ArrayBuffer => {
    if (eventType === PlaybackEventType.STOP_ALL || index === null) {
        return new Uint8Array([eventType]).buffer;
    }

    return new Uint8Array([eventType, index]).buffer;
}

export const marshalControlEvent = (eventType: ControlEventType, payload: ControlPayload): ArrayBuffer => {
    const encPayload = encoder.encode(JSON.stringify(payload));
    const result = new Uint8Array(1 + 2 + encPayload.length); 

    let idx = 0;
    result[idx++] = eventType;

    const payloadLengthBuffer = new Uint8Array(new Uint16Array([encPayload.length]).buffer);
    result.set(payloadLengthBuffer, idx);
    idx += 2;

    result.set(encPayload, idx);
    return result.buffer;
}

export const unmarshalControlEvent = (buffer: ArrayBuffer): ControlEvent | null => {
    if (buffer.byteLength < 3) {
        console.error('unmarshal: buffer too short', buffer);
        return null;
    }

    const data = new Uint8Array(buffer);
    let idx = 0;
    const eventType = data[idx++] as ControlEventType;

    const payloadLength = new Uint16Array(data.slice(idx, idx + 2).buffer)[0];
    idx += 2;

    if (idx + payloadLength > data.length) {
        console.error('unmarshal: buffer is shorter than expected', buffer);
        return null;
    }

    let payload: any;
    try {
        payload = JSON.parse(decoder.decode(data.subarray(idx, idx + payloadLength)));
    } catch (e) {
        console.log('unmarshal: failed to parse payload type', eventType, e, buffer);
    }

    // Adjust the payload for Chord type
    if (Array.isArray(payload) && payload.length > 0 && 'midiValues' in payload[0] && 'midiValuesLength' in payload[0]) {
        payload = payload.map((chord: any) => {
            const midiValuesUint8 = new Uint8Array(chord.midiValuesLength);
            midiValuesUint8.set(chord.midiValues);
            return {
                chordSymbol: chord.chordSymbol,
                midiValues: midiValuesUint8
            };
        });
    }

    return { type: eventType, payload };
}
