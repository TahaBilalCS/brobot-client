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

        const chatClient = new ChatClient({ authProvider, channels: ['lebrotherbill'] });

        console.log('Connecting to twurple client...');
        await chatClient.connect();
        console.log('Connecting succeeded');

        chatClient.onMessage((channel, user, message) => {
            console.log('Message:', message);
            if (message === '!ping') {
                chatClient.say(channel, 'pong!');
            } else if (message === '!dice') {
                const diceRoll = Math.floor(Math.random() * 6) + 1;
                chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
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
