import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { DatabaseError } from 'pg';
import { PgErrorCodes } from 'src/lib/pg-error-codes';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.userRepository.create({
      username,
      password,
    });

    try {
      await this.userRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const pgError = error.driverError as DatabaseError;

        if (pgError.code === PgErrorCodes.UNIQUE_CONSTRAINT_VIOLATION) {
          throw new ConflictException('Username already exists');
        }
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn() {}
}
