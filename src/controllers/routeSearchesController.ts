import { Request, Response } from "express";
import { PostgresRouteSearchDataSource } from "../database/db/routeSearch/postgresRouteSearchDataSource";
import { InvalidParamError } from "../errors/invalidParamError";

const routeSearchDataSource = new PostgresRouteSearchDataSource();

export default class RouteSearchesController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { idCidadeOrigem, idCidadeDestino, idCid, dataViagem, horaViagem } = req.body;

      const routeSearch = await routeSearchDataSource.create({
        idCidadeOrigem,
        idCidadeDestino,
        idCid,
        dataViagem,
        horaViagem,
      });

      res.status(201).json({ mesagem: 'Rota buscada salva com sucesso', routeSearch });
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return res.status(400).send({ erro: error.message });
      }

      return res.status(500).send({ erro: 'Um erro inesperado aconteceu ao tentar salvar a rota buscada' });
    }
  }
}
