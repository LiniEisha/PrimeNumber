const Consul = require('consul');

class ConsulConfig {
    constructor(serviceName) {
        console.log("Start consul");
        //Initialize consumer
        this.consul = new Consul({
            name:"Node 01",
            host: '127.0.0.1',
            port: 8500,
            promisify: true,
        });
    // const id = `${Address}-${hostname}-${serviceIdentity}-${port}`;

        //Service registration and health check configuration in service registry
        this.consul.agent.service.register({
            name: serviceName,
            Address: '127.0.0.1', // Note:127.0.0.1 is the localhost
            port: 3000,
            check: {
                name:serviceName,
                http: 'http://${Address}:${port}/health',
                interval: '10s',
                timeout: '5s',
            }
        }), function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }

            Console.log(serviceName + "registered successfully!");
        }
    }

    async getConfig(key) {
        const result = await this.consul.kv.get(key);

        if (!result) {
            return promise.reject(Key + 'does not exist');
        }

        return JSON.parse(result.Value);
    }

    //Read user configuration simple package
    async getUserConfig(key) {
        const result = await this.getConfig('develop/user');

        if (!key) {
            return result;
        }

        return result[key];
    }

    //Update user configuration simple package
    async setUserConfig(key, val) {
        const user = await this.getConfig('develop/user');

        user[key] = val;

        return this.consul.kv.set('develop/user', JSON.stringify(user))
    }
}

module.exports = ConsulConfig;