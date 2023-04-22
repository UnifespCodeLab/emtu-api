import { Pool } from "pg";
import { ReportDto } from "../../../dtos/reportDto";
import { InvalidParamError } from "../../../errors/invalidParamError";
import Report from "../../../models/report";
import IReportsDataSource from "../../interfaces/reportsDataSource";
import PostgresDB from "../postgresDB";

export class PostgresReportsDataSource implements IReportsDataSource {
  private dataBase: Pool;

  constructor() {
    this.dataBase = PostgresDB.getInstance();
  }

  async create(params: ReportDto): Promise<Report> {
    await Report.validate(params);

    const reportExists = await this.exists(params);

    if (reportExists) {
      throw new InvalidParamError('Solicitação para esta rota já foi enviada');
    }

    const dataCriacao = new Date();
    const query = {
      text: `INSERT INTO reports(email, id_cidade_origem, id_cidade_destino, id_cid, data_criacao)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      values: [
        params.email,
        params.idCidadeOrigem,
        params.idCidadeDestino,
        params.idCid,
        dataCriacao
      ],
    };

    const { rows } = await this.dataBase.query(query);

    return rows[0];
  };

  private async exists(params: ReportDto): Promise<boolean> {
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

    const { rowCount } = await this.dataBase.query(query);

    return rowCount > 0;
  };
}
