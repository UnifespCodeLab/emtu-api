import request from 'supertest';
import express from 'express';
import cidsController from '../../src/controllers/cidsController';
import { GetAllCidsUseCase } from '../../src/models/useCases/cids/getAll';

const cidsRoutes = express();
cidsRoutes.get('/', cidsController.getAll);

describe("cidsController.getAll", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 200 and the array of CIDs when getAll is successful", async () => {
    const result = [
      {
        "id": 1,
        "cod": "B20.0",
        "diagnostic": "Doença pelo HIV resultando em infecções microbacterianas (resultando em tuberculose)",
        "observations": "",
        "companion": "Não",
        "duration": 1,
        "requirements": "Relatório Médico com CID +\nteste de Tuberculose + receitas (se tiver teste HIV + )",
        "group": "G3"
      },
      {
        "id": 2,
        "cod": "B20.1",
        "diagnostic": "Doença pelo HIV resultando em outras infecções bacterianas",
        "observations": "Somente com doença oportunista: A15 até A19;B58 e B59;J13 até J18 e J65;C46",
        "companion": "Não",
        "duration": 1,
        "requirements": "Relatório Médico com CID e\ndescrição das oportunistas atuais (se tiver teste HIV + infecções )",
        "group": "G3"
      }
    ];

    const executeMock = jest
      .spyOn(GetAllCidsUseCase.prototype, 'execute')
      .mockResolvedValueOnce(result);

    const res = await request(cidsRoutes)
      .get('/')
      .set('Content-Type', 'application/json');

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(result);
  });

  test("should return 500 and error message when getAll throws an exception", async () => {
    const executeMock = jest
      .spyOn(GetAllCidsUseCase.prototype, 'execute')
      .mockRejectedValueOnce(new Error("exception"));

    const res = await request(cidsRoutes)
      .get('/')
      .set('Content-Type', 'application/json');

    expect(executeMock).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ mensagem: 'Erro ao obter cids' });
  });
});
