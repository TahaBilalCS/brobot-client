/* eslint-disable */
import process from 'process';
import mongoose from 'mongoose';
import { TwurpleInterface } from '../models/Twurple.js';

import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';

// Now, as long as top-level await has not landed in popular runtimes, you need to work around that by placing
// your main routine inside an async function and running it.
export async function init(): Promise<any> {
    const Twurple = mongoose.model<TwurpleInterface>('twurple');
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
    const TWITCH_SECRET = process.env.TWITCH_SECRET || '';
    const twurpleOptions: TwurpleInterface | null = await Twurple.findOne({}); // TODO query twurple data better

    // If twurple setup options are found
    if (twurpleOptions) {
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
                    console.log('UPDATE DB', newTokenData);
                    // TODO, when updating MongooseError: Query was already executed: twurple.findOneAndUpdate({}
                    await Twurple.findOneAndUpdate({}, newTokenData, {}, (err, doc) => {
                        if (err) console.log('Error Update Twurple Options DB:\n', err);
                        console.log('Success Update Twurple Options\n', newTokenData);
                    });
                }
            },
            tokenData
        );

        const chatClient = new ChatClient({ authProvider, channels: ['lebrotherbill'] });

        await chatClient.connect();

        chatClient.onMessage((channel, user, message) => {
            console.log('Message:', message);
            if (message === '!ping') {
                chatClient.say(channel, 'Pong!');
            } else if (message === '!dice') {
                const diceRoll = Math.floor(Math.random() * 6) + 1;
                chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
            }
        });
    } else {
        // TODO Create twurple options (have to authenticate through passport b_robot) put in try catch before chatClient authprovider
        console.log('Twurple Options Could Not Be Retreived From Database');
    }
}

// https://id.twitch.tv/oauth2/authorize?client_id=v0fyagwzqvv0num859ec4cu7kiuhwc
//     &redirect_uri=http://localhost:3000/auth/twitch/callback
// &response_type=code
// &scope=chat:read+chat:edit
