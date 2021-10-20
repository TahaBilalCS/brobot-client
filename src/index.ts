/* eslint-disable */
import WebSocket from 'ws';
import process from 'process';
import { IncomingEvents, OutgoingEvents } from './types/EventsInterface.js';
import { disableEnterKey } from './commands.js';

// Connect to websocket and handle reconnecting
const clientSocketConnect = () => {
    // TODO turn into classes when activating commands, pass the incoming event & websocket into commands class
    let brobotSocket: WebSocket | undefined;
    try {
        brobotSocket = new WebSocket(process.env.WS_URL || '');
    } catch (err) {
        console.log('Error Creating Websocket', err);
    }

    // Websocket created
    if (brobotSocket) {
        // When websocket opened, notify server
        brobotSocket.onopen = (event: WebSocket.Event) => {
            console.log("Connected to Websocket")
            console.log(new Date().toLocaleString())
            brobotSocket?.send(OutgoingEvents.TRAMA_CONNECTED);
        };

        // When socket receives message, run a command
        brobotSocket.onmessage = (event: WebSocket.MessageEvent) => {
            console.log('Received', event.data);
            switch (event.data) {
                case IncomingEvents.CHATBAN:
                    disableEnterKey(brobotSocket);
                    break;
                default:
                    console.log('Unknown command received from server', event.data);
            }
        };

        // When client socket closes, reconnect again
        brobotSocket.onclose = (event: WebSocket.CloseEvent) => {
            setTimeout(() => {
                clientSocketConnect();
            }, 5000);

            console.log('Socket is closed. Reconnect will be attempted in 5 seconds', event.reason);
            console.log(new Date().toLocaleString())
        };

        // When socket errors out, close then reconnect
        brobotSocket.onerror = (event: WebSocket.ErrorEvent) => {
            console.log('Websocket Emitted Error', event.message);
            brobotSocket?.close()
        };
    }
};

clientSocketConnect();