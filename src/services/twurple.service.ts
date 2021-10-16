/* eslint-disable */
import process from 'process';
import mongoose from 'mongoose';
import { TwurpleInterface } from '../models/Twurple.js';
import { Instance } from 'express-ws';

import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';

// Now, as long as top-level await has not landed in popular runtimes, you need to work around that by placing
// your main routine inside an async function and running it.
export async function init(wsInstance: Instance): Promise<any> {
    const Twurple = mongoose.model<TwurpleInterface>('twurple');
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
    const TWITCH_SECRET = process.env.TWITCH_SECRET || '';

    // Create a new WebSocket. TODO AS CLIENT: RAMA'S SIDE
    // var socket = new WebSocket('ws://echo.websocket.org');

    console.log('Connect websocket');
    wsInstance.app.ws('/', (ws, req) => {
        ws.on('message', msg => {
            ws.send('Sup loser');
            console.log('Sent:', 'Sup loser');
        });

        ws.on('close', () => {
            console.log('WebSocket was closed');
        });
    });

    console.log(wsInstance);
    // wsInstance.getWss().clients.forEach(client => {
    //     // if(client.name / ip === trama){
    //     //     client.send("Sup loser");
    //     // }
    // });

    let twurpleOptions: TwurpleInterface | null = await Twurple.findOne({}); // TODO query twurple data better
    // If no options found
    if (!twurpleOptions) {
        console.log('Twurple Config Could Not Be Retreived From Database');
        const newTwurpleConfig = {
            accessToken: process.env.BROBOT_ACCESS_TOKEN,
            refreshToken: process.env.BROBOT_REFRESH_TOKEN,
            scope: ['chat:edit', 'chat:read', 'user_read'],
            expiresIn: 0,
            obtainmentTimestamp: 0
        };
        twurpleOptions = await new Twurple(newTwurpleConfig).save();
        console.log('Created New Twurple Config', twurpleOptions.obtainmentTimestamp);
    }

    try {
        const tokenData: TwurpleInterface = {
            accessToken: twurpleOptions.accessToken,
            refreshToken: twurpleOptions.refreshToken,
            scope: twurpleOptions.scope,
            expiresIn: twurpleOptions.expiresIn,
            obtainmentTimestamp: twurpleOptions.obtainmentTimestamp
        };
        const authProvider = new RefreshingAuthProvider(
            {
                clientId: TWITCH_CLIENT_ID,
                clientSecret: TWITCH_SECRET,
                onRefresh: async newTokenData => {
                    console.log('UPDATE DB', newTokenData.obtainmentTimestamp);
                    // TODO, when updating MongooseError: Query was already executed: twurple.findOneAndUpdate({}
                    await Twurple.findOneAndUpdate({}, newTokenData, {}, (err, doc) => {
                        if (err) console.log('Error Update Twurple Options DB:\n', err);
                        console.log('Success Update Twurple Options\n', newTokenData);
                    });
                }
            },
            tokenData
        );

        const chatClient = new ChatClient({
            authProvider,
            isAlwaysMod: true, // https://twurple.js.org/reference/chat/interfaces/ChatClientOptions.html#isAlwaysMod
            channels: ['lebrotherbill']
        });

        // 100 per 30 seconds
        console.log('Connecting to twurple client...');
        await chatClient.connect();
        console.log('Connecting succeeded');

        //https://stackoverflow.com/questions/30514584/delay-each-loop-iteration-in-node-js-async
        async function sleep(millis: number) {
            return new Promise(resolve => setTimeout(resolve, millis));
        }

        // this is a toughy
        let startDate: number;
        chatClient.onMessage(async (channel, user, message, msg: PrivateMessage) => {
            console.log(`Message: ${new Date().getTime() - startDate}`, message);
            if (message === '!ping') {
                startDate = new Date().getTime();
                let x = [1, 2, 3, 4, 5];
                for (const num of x) {
                    await sleep(500);
                    // MWMWMWMWMWMWMWMWMWMWMWMW
                    console.log('LOG', new Date().getTime() - startDate);
                    await chatClient.say(channel, `HO: ${new Date().getTime() - startDate}`); // check if differnt in 1080p)
                }
            } else if (message === '!dice') {
                const diceRoll = Math.floor(Math.random() * 6) + 1;
                await chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
            }
        });
    } catch (err) {
        console.log('Error initializing Twurple');
    }
}

// https://id.twitch.tv/oauth2/authorize?client_id=
// &redirect_uri=
// &response_type=code
// &scope=chat:read+chat:edit
