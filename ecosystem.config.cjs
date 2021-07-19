export default {
    apps: [
        {
            name: "BackendBill",
            script: "dist/index.js",
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
            // emv_test:{
            //     NODE_ENV: "test"
            // }
        }
    ],
    deploy: {
        production: {
            user: "ubuntu",
            host: "ec2-3-231-208-118.compute-1.amazonaws.com",
            key: "~/.ssh/billbo-key.pem",
            ref: "origin/main",
            repo: "git@github.com:TahaBilalCS/BackendBill.git",
            path: "/home/ubuntu/BackendBill",
            "post-deploy": "npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env production"
        }
    }
};
