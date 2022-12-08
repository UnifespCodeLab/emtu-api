import { Pool, QueryResult } from "pg";
import { UserDto } from "../../../dtos/userDto";
import User from "../../../models/user";
import IUserDataSource from "../../interfaces/userDataSource";
import PostgresDB from "../postgresDB";

export class PostgresUserDataSource implements IUserDataSource {
  private dataBase: Pool;

  constructor(){
    this.dataBase = PostgresDB.getInstance();
  }

  async getByEmail(email: string): Promise<User> {
    const result = await this.dataBase.query(`SELECT * FROM users u WHERE u.email = '${email}';`);
    return PostgresUserDataSource.mapResultToModel(result)[0];
  }

  async create(user : User) : Promise<QueryResult> {
    const data = await this.dataBase.query(`INSERT INTO users(name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}') RETURNING *`);
    return data.rows[0];
  };
  
  private static mapResultToModel = (result: QueryResult<UserDto>): User[] => result.rows.map(
    (row) => (new User(row.name, row.email, row.password))
  );
} 