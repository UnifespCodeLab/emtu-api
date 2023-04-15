import { Request, Response } from "express";
import { PostgresReportsDataSource } from "../database/db/reports/postgresReportsDataSource";
import { ReportDto } from "../dtos/reportDto";
import { InvalidParamError } from "../errors/invalidParamError";
import Email from "../models/email";

const reportsDataSource = new PostgresReportsDataSource();

export default class ReportsController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { email, idCidadeOrigem, idCidadeDestino, idCid } = req.body;

      const params: ReportDto = { email, idCidadeOrigem, idCidadeDestino, idCid };

      ReportsController.validateParams(params);

      const report = await reportsDataSource.create(params);

      res.status(201).json({ mesagem: 'Report criado com sucesso', report });
    } catch (error) {
      if (error instanceof InvalidParamError) {
        res.status(400).send({ erro: error.message });
      }

      return res.status(500).send({ erro: 'Falha no servidor ao criar report' });
    }
  }

  private static async validateParams(params: ReportDto) {
    const requiredParams = ['email', 'idCidadeOrigem', 'idCidadeDestino', 'idCid'];
    const missingParams = requiredParams.filter(requiredParam => !params[requiredParam]);

    if (missingParams.length > 0) {
      throw new InvalidParamError(`Parâmetros obrigatórios não informados: ${missingParams}`);
    }

    if (!Email.validate(params.email)) {
      throw new InvalidParamError(`E-mail informado é inválido: ${params.email}`);
    }

    if (params.idCidadeOrigem === params.idCidadeDestino) {
      throw new InvalidParamError('As cidades de origem e destino não podem ser iguais');
    }

    const reportExists = await reportsDataSource.exists(params);

    if (reportExists) {
      throw new InvalidParamError('Solicitação para esta rota já foi enviada');
    }
  }
}
