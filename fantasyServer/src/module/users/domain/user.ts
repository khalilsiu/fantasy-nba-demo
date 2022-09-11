import { Logger } from '@nestjs/common';
import { IsString, validate, IsDate } from 'class-validator';
import { Result } from 'src/shared/core/Result';

export interface UserProps {
  walletId: string;
  createdAt: Date;
}

export class User {
  @IsString()
  readonly walletId: string;

  @IsDate()
  readonly createdAt: Date;

  static readonly logger = new Logger(User.name);
  constructor({ walletId, createdAt }: UserProps) {
    this.walletId = walletId;
    this.createdAt = createdAt;
  }

  public static async create(props: UserProps): Promise<Result<User>> {
    this.logger.log(`create user`);

    const user = new User(props);
    const errors = await validate(user);
    this.logger.log(`validated create user`);

    if (errors.length > 0) {
      return Result.fail<User>(Object.values(errors[0].constraints)[0]);
    }

    return Result.ok<User>(user);
  }
}
