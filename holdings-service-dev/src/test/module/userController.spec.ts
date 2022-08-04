import { UserRepo } from 'src/module/user/repos/user.repo';

import { mock } from 'jest-mock-extended';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import { HttpException } from '@nestjs/common';
import { GetUserByIdUseCase } from 'src/module/user/useCases/getUserById/getUserByIdUseCase';
import { CreateUserUseCase } from 'src/module/user/useCases/createUser/createUserUseCase';
import { UserController } from 'src/module/user/user.controller';
import { User } from 'src/module/user/domain/user';
import { Result } from 'src/shared/core/Result';
import { GetUserByIdMapper } from 'src/module/user/useCases/getUserById/getUserByIdMapper';
import { UserNotFoundError } from 'src/module/user/useCases/getUserById/getUserByIdErrors';

describe('UserController', () => {
  let userController: UserController;
  let createUserUseCase: CreateUserUseCase;
  let createUserRepo: UserRepo;
  let getUserByIdUseCase: GetUserByIdUseCase;
  const correctCreateUserPayload = { email: 'anthonysiu@gmail.com' };

  beforeEach(() => {
    createUserRepo = mock<UserRepo>();
    createUserUseCase = new CreateUserUseCase(createUserRepo);
    getUserByIdUseCase = new GetUserByIdUseCase(createUserRepo);
    userController = new UserController(createUserUseCase, getUserByIdUseCase);
  });

  it('should return undefined when user is created', async () => {
    const mockCreateUser = jest
      .spyOn(createUserUseCase, 'createUser')
      .mockResolvedValue({
        isLeft: () => false,
        isRight: () => true,
        value: null,
      });
    const result = await userController.createUser(correctCreateUserPayload);
    expect(mockCreateUser).toBeCalledWith({ email: 'anthonysiu@gmail.com' });
    expect(result).toBeUndefined();
  });

  it('should throw HttpException code: 400 when DomainModelCreationError occurs', async () => {
    jest.spyOn(createUserUseCase, 'createUser').mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new DomainModelCreationError('Domain creation error'),
    });
    try {
      await userController.createUser(correctCreateUserPayload);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(400);
    }
  });

  it('should throw HttpException code: 500 when other error occurs', async () => {
    jest.spyOn(createUserUseCase, 'createUser').mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new UnexpectedError('Unexpected error' as any),
    });
    try {
      await userController.createUser(correctCreateUserPayload);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(500);
    }
  });

  it('should return user info when userId is provided', async () => {
    const mockCreateUser = jest
      .spyOn(getUserByIdUseCase, 'getUserById')
      .mockResolvedValue({
        isLeft: () => false,
        isRight: () => true,
        value: Result.ok(
          GetUserByIdMapper.toResDTO(new User('anthonysiu@gmail.com')),
        ),
      });
    const result = await userController.getUserById('1');
    expect(mockCreateUser).toBeCalledWith('1');
    expect(result).toStrictEqual({
      email: 'anthonysiu@gmail.com',
      reputationPoints: undefined,
      name: undefined,
    });
  });

  it('should throw HttpException code: 404 when UserNotFoundError occurs', async () => {
    jest.spyOn(getUserByIdUseCase, 'getUserById').mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new UserNotFoundError('User not found error'),
    });
    try {
      await userController.getUserById('1');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(404);
    }
  });

  it('should throw HttpException code: 500 when other error occurs', async () => {
    jest.spyOn(getUserByIdUseCase, 'getUserById').mockResolvedValue({
      isLeft: () => true,
      isRight: () => false,
      value: new UnexpectedError('Unexpected error' as any),
    });
    try {
      await userController.getUserById('1');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.status).toBe(500);
    }
  });
});
