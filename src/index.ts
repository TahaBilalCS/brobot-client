/* eslint-disable */
import WebSocket from 'ws';
import process from 'process';
import { PythonShell } from 'python-shell';

// function startPythonShell() {
//     // TODO
//     let options = {
//         pythonPath: 'C:\\Users\\Dynorama\\AppData\\Local\\Programs\\Python\\Python39\\python',
//         scriptPath: '/home/brotherbill/brobot-client/src/py_commands'
//     };
//     PythonShell.run('disable_key.py', options, (err: any, results: any) => {
//         if (err) {
//             console.log('Err', err);
//         } else {
//             console.log('Success', results);
//         }
//     });
// }
//
// startPythonShell();

// console.log(process.env.WS_URL);
//
// const brobotSocket = new WebSocket(process.env.WS_URL || '');
//
// // Connection opened
// brobotSocket.addEventListener('open', event => {
//     brobotSocket.send('Hello Server!');
// });

/**
 * if receive chatban-ws,
 */
