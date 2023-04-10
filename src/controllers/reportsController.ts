import { Request, Response } from "express";
import { PostgresReportsDataSource } from "../database/db/reports/postgresReportsDataSource";
import { ReportsDto } from "../dtos/reportsDto";

const reportsDataSource = new PostgresReportsDataSource();

export default class ReportsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, idCidadeOrigem, idCidadeDestino, idCid } = req.body;

      if (!(email && idCidadeOrigem && idCidadeDestino && idCid)) {
        return res.status(400).send({ erro: "Parâmetros inválidos" });
      }

      const params: ReportsDto = { email, idCidadeOrigem, idCidadeDestino, idCid };

      const reportExists = await reportsDataSource.exists(params);

      if (reportExists) {
        res.status(200).json({ mensagem: "Report já existe" });
      }

      const report = await reportsDataSource.create(params);

      res.status(201).json({ mesagem: "Report criado com sucesso", report });
    } catch (error) {
      return res.status(500).send({ erro: "Falha ao criar report" });
    }
  }
}