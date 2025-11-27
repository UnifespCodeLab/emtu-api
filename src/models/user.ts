export default class User {
  public id?: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;

  constructor(name: string, email: string, password: string, id?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  };
}