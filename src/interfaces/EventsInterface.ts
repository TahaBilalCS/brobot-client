/* eslint-disable */
export enum IncomingEvents {
    CHATBAN = 'CHATBAN',
    VOICEBAN = 'VOICEBAN',
    POKEMON_ROAR = 'POKEMON_ROAR'
}

export enum OutgoingEvents {
    CLIENT_CONNECTED = 'CLIENT_CONNECTED',
    CHATBAN_COMPLETE = 'CHATBAN_COMPLETE',
    VOICEBAN_COMPLETE = 'VOICEBAN_COMPLETE',
    CREATE_PREDICTION = 'CREATE_PREDICTION',
    CREATE_MARKER = 'CREATE_MARKER',
    PLAY_AD = 'PLAY_AD'
}

export enum OutgoingErrors {}
