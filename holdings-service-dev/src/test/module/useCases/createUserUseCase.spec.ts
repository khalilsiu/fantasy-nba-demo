import { mock } from 'jest-mock-extended';
import { UserRepo } from 'src/module/user/repos/user.repo';
import { CreateUserUseCase } from 'src/module/user/useCases/createUser/createUserUseCase';
import UnexpectedError, {
  DomainModelCreationError,
} from 'src/shared/core/AppError';
import UseCaseError from 'src/shared/core/UseCaseError';

describe('CreateUserUseCase', () => {
  let createUserRepo: UserRepo;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    createUserRepo = mock<UserRepo>();
    createUserUseCase = new CreateUserUseCase(createUserRepo);
  });

  it('should return isRight when the correct DTO is provided', async () => {
    createUserRepo.createUser = jest.fn().mockResolvedValue(null);
    const result = await createUserUseCase.createUser({
      email: 'anthonysiu@gmail.com',
    });
    expect(result.isRight).toBeTruthy();
    expect(result.value.getValue()).toBeUndefined();
  });

  it('should return isLeft when the incorrect DTO is provided', async () => {
    const result = await createUserUseCase.createUser({ email: 'anthonysiu' });
    expect(result.isLeft).toBeTruthy();
    expect(result.value).toBeInstanceOf(DomainModelCreationError);
    expect((result.value.errorValue() as UseCaseError).message).toBe(
      '_email must be an email',
    );
  });

  it('should return isLeft when the repo throws error', async () => {
    createUserRepo.createUser = jest.fn().mockRejectedValue('Repo error');
    const result = await createUserUseCase.createUser({
      email: 'anthonysiu@gmail.com',
    });
    expect(result.isLeft).toBeTruthy();
    expect(result.value).toBeInstanceOf(UnexpectedError);
    expect((result.value.errorValue() as UseCaseError).message).toBe(
      'An unexpected error occurred.',
    );
  });
});
