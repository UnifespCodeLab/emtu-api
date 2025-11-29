import { QueryResult } from "pg";
import User from './../../models/user';

export default interface IUserDataSource {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<QueryResult<User>>;
  update(user: User): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}