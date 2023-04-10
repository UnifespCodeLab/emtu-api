import { Pool } from "pg";
import { ReportsDto } from "../../../dtos/reportsDto";
import Reports from "../../../models/reports";
import IReportsDataSource from "../../interfaces/reportsDataSource";
import PostgresDB from "../postgresDB";

export class PostgresReportsDataSource implements IReportsDataSource {
  private dataBase: Pool;

  constructor() {
    this.dataBase = PostgresDB.getInstance();
  }

  async exists(params: ReportsDto): Promise<boolean> {
    const query = {
      text: `SELECT * FROM reports
        WHERE email = $1
        AND id_cidade_origem = $2
        AND id_cidade_destino = $3
        AND id_cid = $4`,
      values: [
        params.email,
        params.idCidadeOrigem,
        params.idCidadeDestino,
        params.idCid,
      ],
    };

    const data = await this.dataBase.query(query);

    return data.rowCount > 0;
  };

  async create(params: ReportsDto): Promise<Reports> {
    const query = {
      text: `INSERT INTO reports(email, id_cidade_origem, id_cidade_destino, id_cid)
        VALUES ($1, $2, $3, $4) RETURNING *`,
      values: [
        params.email,
        params.idCidadeOrigem,
        params.idCidadeDestino,
        params.idCid,
      ],
    };

    const data = await this.dataBase.query(query);

    return data?.rows[0];
  };
}
