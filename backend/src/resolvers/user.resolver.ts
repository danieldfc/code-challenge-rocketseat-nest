import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';

import RepoService from '../repo.service';

import User from '../db/models/user.entity';
import UserInput from './input/user.input';

@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly repoService: RepoService) {}

  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    return this.repoService.userRepo.find();
  }
  @Query(() => User, {nullable: true})
  public async getUser(@Args('id') id: number): Promise<User> {
    return  this.repoService.userRepo.findOne(id);
  }

  @Mutation(() => User)
  public async createOrLoginUser(@Args('data') { email }: UserInput):
    Promise<User> {
      let user = await this.repoService.userRepo.findOne({
        where: {
          email: email.toLowerCase().trim(),
        }
      });

      if (!user) {
        user = this.repoService.userRepo.create({
          email: email.toLowerCase().trim(),
        });

        await this.repoService.userRepo.save(user);
      }


      return  this.repoService.userRepo.save(user);
  }
}
