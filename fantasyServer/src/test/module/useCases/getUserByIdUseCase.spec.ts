import { mock } from 'jest-mock-extended';
import { User } from 'src/module/user/domain/user';
import { UserRepo } from 'src/module/user/repos/user.repo';
import { UserNotFoundError } from 'src/module/user/useCases/getUserById/getUserByIdErrors';
import { GetUserByIdUseCase } from 'src/module/user/useCases/getUserById/getUserByIdUseCase';
import UnexpectedError from 'src/shared/core/AppError';
import UseCaseError from 'src/shared/core/UseCaseError';

describe('GetUserById', () => {
  let getUserByIdRepo: UserRepo;
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeEach(() => {
    getUserByIdRepo = mock<UserRepo>();
    getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepo);
  });

  it('should return the correct value when the correct user id is provided', async () => {
    getUserByIdRepo.getUserById = jest
      .fn()
      .mockResolvedValue(new User('anthonysiu@gmail.com'));
    const result = await getUserByIdUseCase.getUserById('1');
    expect(result.isRight).toBeTruthy();
    expect(result.value.getValue()).toStrictEqual({
      email: 'anthonysiu@gmail.com',
      name: undefined,
      reputationPoints: undefined,
    });
  });

  it('should return isLeft when the incorrect DTO is provided', async () => {
    getUserByIdRepo.getUserById = jest.fn().mockResolvedValue(null);
    const result = await getUserByIdUseCase.getUserById('1');
    expect(result.isLeft).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFoundError);
    expect((result.value.errorValue() as UseCaseError).message).toBe(
      'User 1 is not found.',
    );
  });

  it('should return isLeft when the repo throws error', async () => {
    getUserByIdRepo.getUserById = jest.fn().mockRejectedValue('Repo error');
    const result = await getUserByIdUseCase.getUserById('1');
    expect(result.isLeft).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnexpectedError);
    expect((result.value.errorValue() as UseCaseError).message).toBe(
      'An unexpected error occurred.',
    );
  });
});
