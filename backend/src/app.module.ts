import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as configOrm from './config/configuration';

import RepoModule from './repo.module';

import UserResolver from './resolvers/user.resolver';
import MessageResolver from './resolvers/message.resolver';

const graphQLImports = [
  UserResolver,
  MessageResolver,
];

@Module({
  imports: [
    TypeOrmModule.forRoot(configOrm),
    RepoModule,
    ...graphQLImports,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
      installSubscriptionHandlers: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
