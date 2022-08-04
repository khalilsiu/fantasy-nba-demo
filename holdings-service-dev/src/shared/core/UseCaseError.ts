interface IUseCaseError {
  message: string;
  name?: string;
}

export default abstract class UseCaseError implements IUseCaseError {
  public readonly message: string;

  public readonly name: string;

  constructor(message: string, name?: string) {
    this.message = message;
    this.name = name;
  }
}
