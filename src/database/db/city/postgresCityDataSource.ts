import { Pool, QueryResult } from "pg";
import { CityDto } from "../../../dtos/cityDto";
import cityDataSource from "../../interfaces/cityDataSource";
import PostgresDB from "../postgresDB";

export class PostgresCityDataSource implements cityDataSource {
  private dataBase: Pool;

  constructor(){
    this.dataBase = PostgresDB.getInstance();
  }

  async getAll(): Promise<CityDto[]> {
    const result = await this.dataBase.query(`SELECT * FROM city c;`);
    return PostgresCityDataSource.mapResultToModel(result);
  }
  
  private static mapResultToModel = (result: QueryResult): CityDto[] => result.rows.map((row) => ({ id: row.city_id, name: row.city_name}))
} 