import { Pool, QueryResult } from "pg";
import { AccessDto } from "../../../dtos/accessDto";
import Access from "../../../models/access";
import IAccessDataSource from "../../interfaces/accessDataSource";
import PostgresDB from "../postgresDB";

export class PostgresAccessDataSource implements IAccessDataSource {
  private dataBase: Pool;

  constructor() {
    this.dataBase = PostgresDB.getInstance();
  }

  async create(access: Access): Promise<Access | null> {
    const data = await this.dataBase.query(
      `INSERT INTO access(ip, data_acesso) VALUES ($1, $2) RETURNING *`,
      [access.ip, access.data_acesso]
    );
    
    if (data && data.rowCount > 0) {
      const row = data.rows[0];
      const newAccess = new Access(row.ip, row.data_acesso);
      newAccess.id = row.id;
      return newAccess;
    }
    
    return null;
  }

  async getByDate(date: string): Promise<Access[]> {
    const result = await this.dataBase.query(
      `SELECT * FROM access WHERE data_acesso LIKE $1`,
      [`${date}%`]
    );
    return result && result.rowCount > 0 
      ? PostgresAccessDataSource.mapResultToModel(result) 
      : [];
  }

  private static mapResultToModel = (result: QueryResult<AccessDto>): Access[] => {
    return result ? result.rows.map(
      (row) => {
        const access = new Access(row.ip, row.data_acesso);
        access.id = row.id;
        return access;
      }
    ) : [];
  };
}