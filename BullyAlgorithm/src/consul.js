const Consul = require('consul');

class ConsulConfig {
    constructor(serviceName) {
        console.log("Starting the consul");
        this.consul = new Consul({
            name: "Node01",
            host: '127.0.0.1',
            port: 8500,
            promisify: true,
        });

        this.consul.agent.service.register({
            name: serviceName,
            address: '127.0.0.1',
            port: 3000,
            check: {
                name: serviceName,
                http: `http://127.0.0.1:3000/health`,
                interval: '10s',
                timeout: '5s',
            }
        }, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log(`${serviceName} registered successfully!`);
        });
    }

    async getConfig(key) {
        try {
            const result = await this.consul.kv.get(key);

            if (!result) {
                return Promise.reject(`${key} does not exist`);
            }

            return JSON.parse(result.Value);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //Read user configuration
    async getUserConfig(key) {
        try {
            const result = await this.getConfig('develop/user');

            if (!key) {
                return result;
            }

            return result[key];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //Update user configuration
    async setUserConfig(key, val) {
        try {
            const user = await this.getConfig('develop/user');

            user[key] = val;

            return this.consul.kv.set('develop/user', JSON.stringify(user));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = ConsulConfig;