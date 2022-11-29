/* eslint-disable */
import process from 'process';
import { PythonShellError } from 'python-shell';
import shell from 'python-shell';
const { PythonShell } = shell; // Todo Note: Should wait for iohook library to support Node 14+ to get rid of this syntax

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import WebSocket from 'ws';
import { OutgoingEvents } from './interfaces/EventsInterface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, '../src/py_commands/');

// TODO this could be a class we initialize with brobotSocket so we don't have to pass it in to every function
export const disableEnterKey = (brobotSocket: WebSocket | undefined): void => {
    const options = {
        pythonPath: process.env.PYTHON_PATH,
        scriptPath: scriptPath,
        args: ['300'] /** How long to disable Enter key? (seconds) */
    };
    PythonShell.run('chatban.py', options, (err?: PythonShellError, output?: any[]) => {
        // todo sent ChabanComplete with error as data
        if (err) {
            console.log('ChatBan Err', err);
            brobotSocket?.send(JSON.stringify({ event: OutgoingEvents.CHATBAN_COMPLETE, data: err }));
        } else {
            brobotSocket?.send(JSON.stringify({ event: OutgoingEvents.CHATBAN_COMPLETE, data: null }));
        }
    });
};

export const voiceBan = (brobotSocket: WebSocket | undefined): void => {
    const options = {
        pythonPath: process.env.PYTHON_PATH,
        scriptPath: scriptPath,
        args: ['30'] /** How long to keep mic muted? (seconds) */
    };
    PythonShell.run('voiceban.py', options, (err?: PythonShellError, output?: any[]) => {
        if (err) {
            console.log('VoiceBan Err', err);
            brobotSocket?.send(JSON.stringify({ event: OutgoingEvents.VOICEBAN_COMPLETE, data: err }));
        } else {
            brobotSocket?.send(JSON.stringify({ event: OutgoingEvents.VOICEBAN_COMPLETE, data: null }));
        }
    });
};

// export const keyboardType = (): void => {
//     const options = {
//         pythonPath: process.env.PYTHON_PATH,
//         scriptPath: scriptPath,
//         args: ['Some long string']
//     };
//     console.log('test');
//     PythonShell.run('test.py', options, (err?: PythonShellError, output?: any[]) => {
//         if (err) {
//             console.log('ERRR Err', err);
//         } else {
//             console.log('ALL GOOD?', err);
//         }
//     });
//
//     import keyboard
//     import time
//     import sys
//     import random
//     time.sleep(1)
//     strg_args=sys.argv[1] # seconds
//     for char in strg_args:
//     keyboard.press_and_release(char)
//     time.sleep(random.uniform(0, 0.7))
//
//     time.sleep(1)
//     quit()
// };
