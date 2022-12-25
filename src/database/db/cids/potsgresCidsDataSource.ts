import { Pool, QueryResult } from "pg";
import { CidsDto } from "../../../dtos/cidsDto";
import cidsDataSource from "../../interfaces/cidsDataSource";
import PostgresDB from "../postgresDB";

export class PostgresCidsDataSource implements cidsDataSource {
  private dataBase: Pool;

  constructor(){
    this.dataBase = PostgresDB.getInstance();
  }

  async getAll(): Promise<CidsDto[]> {
    const result = await this.dataBase.query(`Select * from cids;`);
    return PostgresCidsDataSource.mapResultToModel(result);
  }

  private static mapResultToModel = (result: QueryResult): CidsDto[] => result.rows.map((row) => {
    console.log(row);

    return(
      {
        id: row.id,
        cod: row.cod,
        diagnostic: row.diagnostic,
        observations: row.observations,
        companion: row.companion,
        duration: row.duration,
        requirements: row.requirements,
        "group": row.group,
      })
  })
}