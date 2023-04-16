import { Request, Response } from "express";
import { PostgresReportsDataSource } from "../database/db/reports/postgresReportsDataSource";
import { InvalidParamError } from "../errors/invalidParamError";

const reportsDataSource = new PostgresReportsDataSource();

export default class ReportsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, idCidadeOrigem, idCidadeDestino, idCid } = req.body;

      const report = await reportsDataSource.create({ email, idCidadeOrigem, idCidadeDestino, idCid });

      res.status(201).json({ mesagem: 'Report criado com sucesso', report });
    } catch (error) {
      if (error instanceof InvalidParamError) {
        return res.status(400).send({ erro: error.message });
      }

      return res.status(500).send({ erro: 'Falha no servidor ao criar report' });
    }
  }
}
