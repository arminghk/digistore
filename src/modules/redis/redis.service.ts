import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost', 
      port: 6379,        
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async set(key: string, value: string, expiresInSeconds: number) {
    await this.client.set(key, value, 'EX', expiresInSeconds);
  }

  async get(key: string): Promise<string | null> {
    const type = await this.client.type(key);
    if (type === 'hash') {
      await this.client.del(key);
    }
    return this.client.get(key);
  }
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
  async getExpirationTime(key: string): Promise<number> {
    return this.client.ttl(key);  
  }
}
