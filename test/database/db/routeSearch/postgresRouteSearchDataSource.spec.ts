import { Pool } from "pg";
import { PostgresRouteSearchDataSource } from "../../../../src/database/db/routeSearch/postgresRouteSearchDataSource";
import { RouteSearchDto } from "../../../../src/dtos/routeSearchDto";
import { InvalidParamError } from "../../../../src/errors/invalidParamError";
import PostgresDB from "../../../../src/database/db/postgresDB";

describe('PostgresRouteSearchDataSource', () => {
  let dataSource: PostgresRouteSearchDataSource;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    mockPool = { query: jest.fn() } as any;
    jest.spyOn(PostgresDB, 'getInstance').mockReturnValue(mockPool);
    dataSource = new PostgresRouteSearchDataSource();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('create', () => {
    const params: RouteSearchDto = {
      idCidadeOrigem: 1,
      idCidadeDestino: 2,
      idCid: 3,
      dataViagem: '2023-10-05',
      horaViagem: '10:25'
    };

    it('should validate params before creating route search', async () => {
      const invalidRouteSearchDto = { ...params, idCidadeOrigem: null };

      await expect(dataSource.create(invalidRouteSearchDto)).rejects.toThrow(InvalidParamError);

      expect(mockPool.query).not.toHaveBeenCalled();
    });

    it('should insert new route search if params are valid', async () => {
      const currentDate = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);

      const expectedRouteSearch = { ...params, id: 1, dataCriacao: currentDate };
      mockPool.query.mockResolvedValueOnce({ rows: [expectedRouteSearch] } as never);

      const createdRouteSearch = await dataSource.create(params);

      expect(createdRouteSearch).toEqual(expectedRouteSearch);
      expect(mockPool.query).toHaveBeenCalledWith({
        text: expect.stringContaining('INSERT INTO searches'),
        values: [
          params.idCidadeOrigem,
          params.idCidadeDestino,
          params.idCid,
          params.dataViagem,
          params.horaViagem,
          currentDate,
        ],
      });
    });
  });

  describe('findBy', () => {
    const expectedRows = [{ id: 1 }];

    it('should return all searches if no filters are provided', async () => {
      const expectedQuery = ' SELECT * FROM searches s ';

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy({} as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return searches filtered by idCidadeOrigem', async () => {
      const expectedQuery = ' SELECT * FROM searches s WHERE s.id_cidade_origem = 1';
      const filters = { idCidadeOrigem: 1 };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy(filters as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return searches filtered by idCidadeDestino', async () => {
      const expectedQuery = ' SELECT * FROM searches s WHERE s.id_cidade_destino = 1';
      const filters = { idCidadeDestino: 1 };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy(filters as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return searches filtered by idCid', async () => {
      const expectedQuery = ' SELECT * FROM searches s WHERE s.id_cid = 1';
      const filters = { idCid: 1 };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy(filters as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return searches filtered by dataInicio', async () => {
      const expectedQuery = ' SELECT * FROM searches s WHERE date(s.data_criacao) >= \'2022-01-01\'';
      const filters = { dataInicio: '2022-01-01' };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy(filters as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return searches filtered by dataFim', async () => {
      const expectedQuery = ' SELECT * FROM searches s WHERE date(s.data_criacao) <= \'2022-01-01\'';
      const filters = { dataFim: '2022-01-01' };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy(filters as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return searches filtered by all filters', async () => {
      const expectedQuery =
        ' SELECT * FROM searches s' +
        ' WHERE s.id_cidade_origem = 1' +
        ' AND s.id_cidade_destino = 2' +
        ' AND s.id_cid = 3' +
        ' AND date(s.data_criacao) >= \'2022-01-01\'' +
        ' AND date(s.data_criacao) <= \'2022-01-02\'';

      const filters = {
        idCidadeOrigem: 1,
        idCidadeDestino: 2,
        idCid: 3,
        dataInicio: '2022-01-01',
        dataFim: '2022-01-02'
      };

      mockPool.query.mockResolvedValueOnce({ rows: [expectedRows] } as never);
      await dataSource.findBy(filters as any);

      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery);
    });
  });
});
