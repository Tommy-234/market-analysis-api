import { User, UserSchema } from './users.schema';
import { Model, model } from 'mongoose';
import { isEmpty } from 'lodash';

export class UserService {
  private user: Model<User>;

  constructor() {
    this.user = model<User>('User', UserSchema);
  }

  async create(newUser: User): Promise<User> {
    const { username } = newUser;
    const exists = await this.find({ username });
    if (isEmpty(exists)) {
      return new this.user(newUser).save();
    }
    throw new Error('Duplicate User');
  }

  async find(where: Record<string, unknown>): Promise<User[]> {
    return await this.user.find(where);
  }

  async findOne(id: string): Promise<User> {
    return await this.user.findById(id);
  }

  async update(id: string, updatedUser: User): Promise<User> {
    const user = await this.findOne(id);
    user.username = updatedUser.username;
    user.password = updatedUser.password;
    user.email = updatedUser.email;
    return await this.user.findByIdAndUpdate(id, user);
  }
}
