import { Request, Response } from "express";
import { PostgresReportsDataSource } from "../database/db/reports/postgresReportsDataSource";
import { ReportsDto } from "../dtos/reportsDto";

const reportsDataSource = new PostgresReportsDataSource();

export default class ReportsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, idCidadeOrigem, idCidadeDestino, idCid } = req.body;
      const params: ReportsDto = { email, idCidadeOrigem, idCidadeDestino, idCid };

      if (!Object.values(params).every(Boolean)) {
        return res.status(400).send({ erro: "Parâmetros inválidos" });
      }

      const reportExists = await reportsDataSource.exists(params);

      if (reportExists) {
        return res.status(200).json({ mensagem: "Report já existe" });
      }

      const report = await reportsDataSource.create(params);

      res.status(201).json({ mesagem: "Report criado com sucesso", report });
    } catch (_error) {
      return res.status(500).send({ erro: "Falha ao criar report" });
    }
  }
}