/* eslint-disable */
export enum IncomingEvents {
    CHATBAN = 'CHATBAN',
    VOICEBAN = 'VOICEBAN',
    PONG = 'TRAMA_PONG'
}

export enum OutgoingEvents {
    TRAMA_CONNECTED = 'TRAMA_CONNECTED',
    CHATBAN_COMPLETE = 'CHATBAN_COMPLETE',
    VOICEBAN_COMPLETE = 'VOICEBAN_COMPLETE',
    CREATE_PREDICTION = 'CREATE_PREDICTION',
    CREATE_MARKER = 'CREATE_MARKER',
    PLAY_AD = 'PLAY_AD',
    PING = 'TRAMA_PING'
}

export enum OutgoingErrors {}
