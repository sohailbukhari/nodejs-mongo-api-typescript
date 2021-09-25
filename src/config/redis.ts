import redis from 'redis';

const RedisClient = redis.createClient();

RedisClient.on('error', (err) => console.log(err));
RedisClient.on('ready', () => console.log('------------ Success: Redis -------------- '));

export default RedisClient;
