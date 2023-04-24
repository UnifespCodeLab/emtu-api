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
}
