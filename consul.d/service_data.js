const Consul = require('consul');

class ConsulConfig {
    constructor() {
        const serviceName = 'consul-serviceRegistry';

        //Initialize consumer
        this.consul = new Consul({
            host: '192.168.6.128',
            port: 8500,
            promisify: true,
        });

        //Service registration and health check configuration
        this.consul.agent.service.register({
            name: serviceName,
            Address: '192.168.20.193', // Note: 192.168.20.193 is my local intranet IP, which can be viewed through ifconfig
            port: 3000,
            check: {
                http: 'http://192.168.20.193:3000/health',
                interval: '10s',
                timeout: '5s',
            }
        }), function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }

            Console.log(servicename + "registered successfully!");
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