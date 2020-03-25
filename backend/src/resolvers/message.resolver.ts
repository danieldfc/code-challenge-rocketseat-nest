import { Resolver, Mutation, Query, Args, ResolveField, Parent } from '@nestjs/graphql';

import RepoService from '../repo.service';

import User from '../db/models/user.entity';
import Message from '../db/models/message.entity';

import MessageInput, { DeleteMessageInput } from './input/message.input';

@Resolver(() => Message)
export default class MessageResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [Message])
  public async getMessages(): Promise<Message[]> {
    return this.repoService.messageRepo.find();
  }

  @Query(() => [Message], {nullable: true})
  public async getMessagesFromUser(@Args('userId') userId: number): Promise<Message[]> {
    return this.repoService.messageRepo.find({
      where: { userId }
    });
  }

  @Query(() => Message, {nullable: true})
  public async getMessage(@Args('id') id: number): Promise<Message> {
    return this.repoService.messageRepo.findOne(id);
  }

  @Mutation(() => Message)
  public async createMessage(
    @Args('data') input: MessageInput
    ): Promise<Message> {
      const message = this.repoService.messageRepo.create({
        content: input.content,
        userId: input.userId,
      });

      return  this.repoService.messageRepo.save(message);
  }

  @Mutation(() => Message, { nullable: true })
  public async deleteMessage(
    @Args('data') input: DeleteMessageInput
    ): Promise<Message> {
      const message = await this.repoService.messageRepo.findOne(input.id);

      if (!message || message.userId !== input.userId) {
        throw new Error(
          'Message does not exists or you are not the message author',
        );
      }

      const copy = { ...message };

      await this.repoService.messageRepo.remove(message);

      return copy;
  }

  @ResolveField(() => User, { name: 'user' })
  public async getUser(@Parent() parent: Message): Promise<User> {
    return this.repoService.userRepo.findOne(parent.userId);
  }
}
