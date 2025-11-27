import { Request, Response } from "express";
import { PostgresAccessDataSource } from "../database/db/access/postgresAccessDataSource";
import { getAccessDate } from "../utils/accessUtils";
import Access from "../models/access";

const accessDataSource = new PostgresAccessDataSource();

export default class AccessController {
  public static async trackAccess(req: Request, res: Response): Promise<Response> {
    try {
      const ip = req.body.ip || 
                 req.headers['x-forwarded-for'] as string || 
                 req.connection.remoteAddress || 
                 'unknown';

      const accessDate = getAccessDate();
      const access = new Access(ip, accessDate);
      const result = await accessDataSource.create(access);

      if (!result) {
        return res.status(500).send({
          erro: "Falha ao registrar acesso"
        });
      }

      return res.status(201).json({
        mensagem: "Acesso registrado com sucesso",
        acesso: {
          id: result.id,
          ip: result.ip,
          data_acesso: result.data_acesso
        }
      });

    } catch (error) {
      console.error("Erro ao registrar acesso:", error);
      return res.status(500).send({
        erro: "Falha ao registrar acesso"
      });
    }
  }

  public static async getDailyAccess(req: Request, res: Response): Promise<Response> {
    try {
      let date = req.query.date as string;

      if (!date) date = getAccessDate();

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).send({
          erro: "Formato de data inválido. Use YYYY-MM-DD"
        });
      }

      const accesses = await accessDataSource.getByDate(date);

      return res.status(200).json({
        data: date,
        quantidade_acessos: accesses.length,
      });

    } catch (error) {
      console.error("Erro ao buscar acessos:", error);
      return res.status(500).send({
        erro: "Falha ao buscar acessos diários"
      });
    }
  }
}