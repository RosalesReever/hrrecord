import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // CREATE USER
  async create(data: Partial<User>) {
    const existingUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password!, 10);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: 'USER',
    });

    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;

    return result;
  }

  // GET ALL USERS
  async findAll() {
    return this.userRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // GET USER BY ID
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // UPDATE USER
  async update(id: number, data: Partial<User>) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        10,
      );
    }

    Object.assign(user, updateData);

    const savedUser = await this.userRepository.save(user);

    const { password, ...result } = savedUser;

    return result;
  }

  // DELETE USER
  async remove(id: number) {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    return {
      message: 'User deleted successfully',
    };
  }
}
