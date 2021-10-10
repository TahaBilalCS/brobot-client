require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'brobot',
            script: 'dist/index.js',
            watch_delay: 1000,
            ignore_watch: ['node_modules'],
            env_development: {
                NODE_ENV: 'development',
                PORT: process.env.PORT,
                DOMAIN: process.env.DOMAIN,
                TEST_SECRET: process.env.TEST_SECRET,
                SESSION_SECRET: process.env.SESSION_SECRET,
                //
                TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.TWITCH_SECRET,
                TWITCH_CALLBACK_URL: process.env.TWITCH_CALLBACK_URL,
                //
                MONGO_URI: process.env.MONGO_URI,
                COOKIE_KEY: process.env.PROD_COOKIE_KEY
            },
            // pm2 stop all to reload new environment variables
            env_production: {
                // NODE_ENV: 'production',
                // PORT: process.env.PORT,
                // DOMAIN: process.env.DOMAIN,
                // TEST_SECRET: process.env.PROD_TEST_SECRET,
                // SESSION_SECRET: process.env.PROD_SESSION_SECRET,
                // // We can't access some prod variables from localhost
                // TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
                // TWITCH_SECRET: process.env.TWITCH_SECRET,
                // TWITCH_CALLBACK_URL: process.env.TWITCH_CALLBACK_URL,
                // //
                // MONGO_URI: process.env.PROD_MONGO_URI,
                // COOKIE_KEY: process.env.PROD_COOKIE_KEY
            },
            // Don't overwrite injected variables on remote machine
            env_aws: {

            }
        }
    ],
    deploy: {
        production: {
            user: process.env.AWS_USER,
            host: process.env.AWS_PUBLIC_IP,
            key: process.env.AWS_SSH_KEY,
            ref: 'origin/main',
            repo: 'git@github.com:TahaBilalCS/brobot.git',
            path: process.env.AWS_EC2_PATH,
            env: {
                NODE_ENV: 'production',
                PORT: process.env.PORT,
                DOMAIN: process.env.DOMAIN,
                TEST_SECRET: process.env.PROD_TEST_SECRET,
                SESSION_SECRET: process.env.PROD_SESSION_SECRET,
                //
                TWITCH_CLIENT_ID: process.env.PROD_TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.PROD_TWITCH_SECRET,
                TWITCH_CALLBACK_URL: process.env.PROD_TWITCH_CALLBACK_URL,
                //
                MONGO_URI: process.env.PROD_MONGO_URI,
                COOKIE_KEY: process.env.PROD_COOKIE_KEY
            },
            // pm2 caches environment variables and --update-env doesn't seem to be working
            // Need to delete pm2 instance before starting instance again to update
            'post-deploy':
                'npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --update-env [--env production]'
        }
    }
};
