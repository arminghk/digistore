import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createMongooseOptions(): MongooseModuleOptions {
        const uri = this.configService.get<string>('Db.MONGODB_URI');
        return {
            uri,
            connectionFactory: (connection) => {
                console.log('MongoDB connected successfully');
                return connection;
            },
        };
    }
}
