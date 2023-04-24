import request from 'supertest';
import express from "express";
import bodyParser from "body-parser";
import RouteSearchesController from '../../src/controllers/routeSearchesController';
import { PostgresRouteSearchDataSource } from '../../src/database/db/routeSearch/postgresRouteSearchDataSource';
import { InvalidParamError } from '../../src/errors/invalidParamError';

const routeSearchRoutes = express();

routeSearchRoutes.use(bodyParser.json());
routeSearchRoutes.post('/', RouteSearchesController.create);
routeSearchRoutes.get('/', RouteSearchesController.findBy);

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

    it('should return 201 when route search is created', async () => {
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

  describe('findby', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 500 when query goes wrong', async () => {
      const findByMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'findBy');

      findByMock.mockRejectedValueOnce(new Error('Message'));

      const response = await request(routeSearchRoutes)
        .get('/')
        .send({})
        .set('Content-type', 'application/json')

      expect(findByMock).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
    });

    it('should return 200 when query is successfully', async () => {
      const routeSearches = [{ id: 99, idCidadeOrigem: 1, idCidadeDestino: 2, idCid: 3 }];
      const findByMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'findBy');

      findByMock.mockResolvedValueOnce(routeSearches);

      const response = await request(routeSearchRoutes)
        .get('/')
        .send({})
        .set('Content-type', 'application/json')

      expect(response.status).toBe(200);
      expect(findByMock).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ searches: routeSearches });
    });
  });
});
