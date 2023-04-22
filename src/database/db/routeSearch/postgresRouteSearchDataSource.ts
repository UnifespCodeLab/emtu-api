import { Pool } from "pg";
import { RouteSearchDto } from "../../../dtos/routeSearchDto";
import IRouteSearchDataSource from "../../interfaces/routeSearchDataSource";
import PostgresDB from "../postgresDB";
import RouteSearch from "../../../models/routeSearch";

export class PostgresRouteSearchDataSource implements IRouteSearchDataSource {
  private dataBase: Pool;

  constructor() {
    this.dataBase = PostgresDB.getInstance();
  }

  async create(params: RouteSearchDto): Promise<RouteSearch> {
    await RouteSearch.validate(params);

    const dataCriacao = new Date();
    const query = {
      text: `INSERT INTO searches(id_cidade_origem, id_cidade_destino, id_cid, data_viagem, hora_viagem, data_criacao)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        params.idCidadeOrigem,
        params.idCidadeDestino,
        params.idCid,
        params.dataViagem,
        params.horaViagem,
        dataCriacao
      ],
    };

    const { rows } = await this.dataBase.query(query);

    return rows[0];
  };

  async findBy({ idCidadeOrigem, idCidadeDestino, idCid, dataInicio, dataFim }): Promise<RouteSearchDto[]> {
    const baseQuery = ' SELECT * FROM searches s ';
    const filters = [];

    if (idCidadeOrigem) filters.push(`s.id_cidade_origem = ${idCidadeOrigem}`);
    if (idCidadeDestino) filters.push(`s.id_cidade_destino = ${idCidadeDestino}`);
    if (idCid) filters.push(`s.id_cid = ${idCid}`);
    if (dataInicio) filters.push(`date(s.data_criacao) >= '${dataInicio}'`);
    if (dataFim) filters.push(`date(s.data_criacao) <= '${dataFim}'`);

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const query = baseQuery + whereClause;

    const { rows } = await this.dataBase.query(query);

    return this.mapResultToModel(rows);
  }

  private mapResultToModel = (rows: any[]): RouteSearchDto[] => (
    rows.map(row => ({
      id: row.id,
      idCidadeOrigem: row.id_cidade_origem,
      idCidadeDestino: row.id_cidade_destino,
      idCid: row.id_cid,
      dataCriacao: row.data_criacao
    }))
  )
}
