import { Pool } from "pg";
import { PostgresReportsDataSource } from "../../../../src/database/db/reports/postgresReportsDataSource";
import PostgresDB from "../../../../src/database/db/postgresDB";
import { ReportDto } from "../../../../src/dtos/reportDto";
import Report from "../../../../src/models/report";

describe('PostgresReportsDataSource', () => {
  let dataSource: PostgresReportsDataSource;
  let mockPool: jest.Mocked<Pool>;

  const mockParams: ReportDto = {
    email: 'elton@john.com',
    idCidadeOrigem: 1,
    idCidadeDestino: 2,
    idCid: 3,
  };

  beforeAll(() => {
    PostgresDB.getInstance = jest.fn(() => mockPool);
  });

  beforeEach(() => {
    mockPool = { query: jest.fn() } as unknown as jest.Mocked<Pool>;

    dataSource = new PostgresReportsDataSource();
  });

  describe('exists', () => {
    it('should return true when report exists in database', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 1 } as never);

      const response = await dataSource.exists(mockParams);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('SELECT * FROM reports'),
          values: [
            mockParams.email,
            mockParams.idCidadeOrigem,
            mockParams.idCidadeDestino,
            mockParams.idCid,
          ],
        })
      );
      expect(response).toBeTruthy();
    });

    it('should return false when report does not exist in database', async () => {
      mockPool.query.mockResolvedValueOnce({ rowCount: 0 } as never);

      const response = await dataSource.exists(mockParams);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('SELECT * FROM reports'),
          values: [
            mockParams.email,
            mockParams.idCidadeOrigem,
            mockParams.idCidadeDestino,
            mockParams.idCid,
          ],
        })
      );
      expect(response).toBeFalsy();
    });
  });

  describe('create', () => {
    it('should return the created report', async () => {
      const mockDate = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);

      const mockResult = {
        rows: [
          new Report(
            mockParams.email,
            mockParams.idCidadeOrigem,
            mockParams.idCidadeDestino,
            mockParams.idCid
          ),
        ],
      } as never;

      mockPool.query.mockResolvedValueOnce(mockResult);

      const response = await dataSource.create(mockParams);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining('INSERT INTO reports'),
          values: [
            mockParams.email,
            mockParams.idCidadeOrigem,
            mockParams.idCidadeDestino,
            mockParams.idCid,
            mockDate,
          ],
        })
      );
      expect(response).toBeInstanceOf(Report);
      expect(response).toMatchObject(mockResult['rows'][0]);
    });
  });
});
