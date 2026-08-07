import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6380',
    });

    this.client.on('error', (err) => console.error('❌ Redis error:', err));

    await this.client.connect();
    console.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    console.log('❌ Redis disconnected');
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
