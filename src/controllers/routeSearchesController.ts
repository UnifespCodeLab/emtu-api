import { Request, Response } from "express";
import { PostgresRouteSearchDataSource } from "../database/db/routeSearch/postgresRouteSearchDataSource";
import { InvalidParamError } from "../errors/invalidParamError";
import { RouteSearchDto } from "../dtos/routeSearchDto";

const routeSearchDataSource = new PostgresRouteSearchDataSource();

export default class RouteSearchesController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const routeSearch = await routeSearchDataSource.create(req.body as RouteSearchDto);

      res.status(201).json({ message: 'Rota buscada salva com sucesso', routeSearch });
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return res.status(400).send({ message: error.message });
      }

      return res.status(500).send({ message: 'Um erro inesperado aconteceu ao tentar salvar a rota buscada' });
    }
  }

  public static async findBy(req: Request, res: Response): Promise<Response> {
    try {
      const routeSearches = await routeSearchDataSource.findBy(req.body);

      res.status(200).json({ searches: routeSearches });
    } catch (error) {
      return res.status(500).send({ message: 'Um erro inesperado aconteceu ao buscar informações no banco' });
    }
  }
}
