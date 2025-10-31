import { redisClient } from '../redisClient.js'

export default async function printAllUsers(): Promise<void> {
    // print all keys that start with "user:"
    const keys = await redisClient.keys('user:*')
    for (const key of keys) {
        const data = await redisClient.get(key)
        if (data) {
            console.log(key, JSON.parse(data))
        }
        else {
            console.log('No users were found')
        }
    }
}
