import request from 'supertest';
import express from "express";
import bodyParser from "body-parser";
import RouteSearchesController from '../../src/controllers/routeSearchesController';
import { PostgresRouteSearchDataSource } from '../../src/database/db/routeSearch/postgresRouteSearchDataSource';
import { InvalidParamError } from '../../src/errors/invalidParamError';

const routeSearchRoutes = express();

routeSearchRoutes.use(bodyParser.json());
routeSearchRoutes.post('/', RouteSearchesController.create);

jest.mock('../../src/database/db/routeSearch/postgresRouteSearchDataSource');

describe('RouteSearchesController', () => {
  describe('create', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 when throws a InvalidParamError', async () => {
      const createMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'create');

      createMock.mockRejectedValueOnce(new InvalidParamError('Message'));

      const response = await request(routeSearchRoutes)
        .post('/')
        .send({ idCidadeOrigem: null, idCidadeDestino: 2, idCid: 3, dataViagem: '2023-10-05', horaViagem: '12:48' })
        .set('Content-type', 'application/json')

      expect(createMock).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(400);
    });

    it('should return 500 when throws a another error', async () => {
      const createMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'create');

      createMock.mockRejectedValueOnce(new Error('Message'));

      const response = await request(routeSearchRoutes)
        .post('/')
        .send({ idCidadeOrigem: 1, idCidadeDestino: 2, idCid: 3, dataViagem: '2023-10-05', horaViagem: '12:48' })
        .set('Content-type', 'application/json')

      expect(createMock).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
    });

    it('should return 201 when report is created', async () => {
      const routeSearch = { idCidadeOrigem: 1, idCidadeDestino: 2, idCid: 3, dataViagem: '2023-10-05', horaViagem: '12:48' };
      const createMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'create');

      createMock.mockResolvedValueOnce(routeSearch);

      const response = await request(routeSearchRoutes)
        .post('/')
        .send(routeSearch)
        .set('Content-type', 'application/json')

      expect(response.status).toBe(201);
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ message: 'Rota buscada salva com sucesso', routeSearch });
    });
  });
});
