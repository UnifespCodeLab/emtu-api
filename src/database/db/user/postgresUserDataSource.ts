import { Pool, QueryResult } from "pg";
import { UserDto } from "../../../dtos/userDto";
import User from "../../../models/user";
import IUserDataSource from "../../interfaces/userDataSource";
import PostgresDB from "../postgresDB";

export class PostgresUserDataSource implements IUserDataSource {
  private dataBase: Pool;

  constructor() {
    this.dataBase = PostgresDB.getInstance();
  }

  async getAll(): Promise<User[]> {
    const result = await this.dataBase.query(`SELECT * FROM users;`);
    return result && result.rowCount > 0 ? PostgresUserDataSource.mapResultToModel(result) : [];
  }

  async getById(id: string): Promise<User | null> {
    const result = await this.dataBase.query(`SELECT * FROM users u WHERE u.id = $1;`, [id]);
    return result && result.rowCount > 0 ? PostgresUserDataSource.mapResultToModel(result)[0] : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const result = await this.dataBase.query(`SELECT * FROM users u WHERE u.email = $1;`, [email]);
    return result && result.rowCount > 0 ? PostgresUserDataSource.mapResultToModel(result)[0] : null;
  }

  async create(user: User): Promise<QueryResult<User>> {
    const data = await this.dataBase.query(
      `INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [user.name, user.email, user.password]
    );
    return data && data.rowCount > 0 ? data.rows[0] : null;
  }

  async update(user: User): Promise<boolean> {
    const result = await this.dataBase.query(
      `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
      [user.name, user.email, user.password, user.id]
    );
    return result && result.rowCount > 0;
  }

  private static mapResultToModel = (result: QueryResult<UserDto>): User[] => {
    return result ? result.rows.map(
      (row) => {
        const user = new User(row.name, row.email, row.password);
        user.id = row.id; // Certifique-se de mapear o ID também
        return user;
      }
    ) : [];
  }
}