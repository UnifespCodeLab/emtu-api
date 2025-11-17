import request from 'supertest';
import express from "express";
import bodyParser from "body-parser";
import RouteSearchesController from '../../src/controllers/routeSearchesController';
import { PostgresRouteSearchDataSource } from '../../src/database/db/routeSearch/postgresRouteSearchDataSource';
import { InvalidParamError } from '../../src/errors/invalidParamError';

const routeSearchRoutes = express();

routeSearchRoutes.use(bodyParser.json());
routeSearchRoutes.get('/', RouteSearchesController.get);
routeSearchRoutes.get('/ranking', RouteSearchesController.getRanking);

jest.mock('../../src/database/db/routeSearch/postgresRouteSearchDataSource');

describe('RouteSearchesController', () => {
  describe('get', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 when search is sucessful', async () => {
      const routeSearch = { 
        startDate: '2023/08/26', 
      };

      const result = [{
        idCidadeOrigem: 1,
        idCidadeDestino: 2,
        idLinha: '086',
        sucedida: true,
        idCid: 1,
        dataViagem: '2023/09/26',
        horaViagem: '18:00',
        dataCriacao: '2023/08/26'
      }]

      const createMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'get');
      createMock.mockResolvedValue(result)

      const response = await request(routeSearchRoutes)
        .get('/')
        .query(routeSearch)
        .set('Content-type', 'application/json')

      expect(response.status).toBe(200);
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ data: result });
    });

    it('should return 400 when param is invalid', async () => {
      const routeSearch = [{ 
        startDate: '', 
      }];
      const createMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'get');

      const response = await request(routeSearchRoutes)
        .get('/')
        .query(routeSearch)
        .set('Content-type', 'application/json')

      expect(response.status).toBe(400);
      expect(createMock).toHaveBeenCalledTimes(0);
      expect(response.body).toEqual({ message: 'Informe pelo menos um período: startDate,endDate' });
    });

    it('should return 500 when an unexpected error occurs', async () => {
      const routeSearch = { startDate: '2023/08/26' };
      const getMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'get');
      getMock.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(routeSearchRoutes)
        .get('/')
        .query(routeSearch)
        .set('Content-type', 'application/json');

      expect(response.status).toBe(500);
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ message: 'Um erro inesperado aconteceu ao encontrar as buscas realizadas' });
    });
  });

  describe('getRanking', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 when ranking is successful', async () => {
      const query = { startDate: '2023/08/26' };
      const result = [{ idLinha: '086', ocorrencias: 10 }];

      const rankingMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'getRanking');
      rankingMock.mockResolvedValue(result);

      const response = await request(routeSearchRoutes)
        .get('/ranking')
        .query(query)
        .set('Content-type', 'application/json');

      expect(response.status).toBe(200);
      expect(rankingMock).toHaveBeenCalledTimes(1);
      expect(response.body).toEqual({ data: result });
    });

    it('should return 400 when parameters are invalid', async () => {
      const rankingMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'getRanking');

      const response = await request(routeSearchRoutes)
        .get('/ranking')
        .query({})
        .set('Content-type', 'application/json');

      expect(response.status).toBe(400);
      expect(rankingMock).toHaveBeenCalledTimes(0);
      expect(response.body).toEqual({ message: 'Informe pelo menos um período: startDate,endDate' });
    });

    it('should return 500 when an internal error occurs', async () => {
      const query = { startDate: '2023/09/01' };
      const rankingMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'getRanking');
      rankingMock.mockRejectedValue(new Error('Unexpected error'));

      const response = await request(routeSearchRoutes)
        .get('/ranking')
        .query(query)
        .set('Content-type', 'application/json');

      expect(response.status).toBe(500);
      expect(rankingMock).toHaveBeenCalledTimes(1);
      expect(response.body.message).toBe({'Um erro inesperado aconteceu ao obter o ranking das linhas'});
    });
  });

  describe('validateSearchParams', () => {
    it('should not throw if valid parameters are provided', () => {
      const params = { startDate: '2023/01/01' };
      expect(() => RouteSearchesController.validateSearchParams(params)).not.toThrow();
    });

    it('should throw InvalidParamError if no params are provided', () => {
      const params = {};
      expect(() => RouteSearchesController.validateSearchParams(params))
        .toThrow(new InvalidParamError('Informe pelo menos um período: startDate,endDate'));
    });
  });
});
