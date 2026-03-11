import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { GetCityByIdUseCase } from '../../src/models/useCases/city/getCityById';
import City from '../../src/models/city';
import { GetBusRoutesUseCase } from '../../src/models/useCases/bus/getBusRoutes';
import GetLineUsecase from '../../src/models/useCases/bus/getLine';
import busController from '../../src/controllers/busController';
import { PostgresRouteSearchDataSource } from '../../src/database/db/routeSearch/postgresRouteSearchDataSource';
import { getPrimaryAdaption } from '../../src/utils/cidUtils';
import { VerifyAccessibilityUseCase } from '../../src/models/useCases/vehicles/verifyAccessibilityUseCase';

const busRoutes = express();
busRoutes.use(bodyParser.json());

busRoutes.post('/', busController.getRoutes);

describe('find bus route', () => {
    test('should return 400 when passing an invalid body', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({});
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Objeto enviado é inválido',
        });
    });

    test('should return 400 when passing undefined', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send(undefined);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Objeto enviado é inválido',
        });
    });

    test('should return 400 when originCityId is invalid (>134) - 135', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 135,
            destinationCityId: 2,
            data: '2026-03-10',
            hora: '10:00',
            cid: 1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Cidade de origem ou destino inválidos',
        });
    });

    test('should return 400 when originCityId is invalid !originCityId', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            destinationCityId: 2,
            data: '2026-03-10',
            hora: '10:00',
            cid: 1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Cidade de origem ou destino inválidos',
        });
    });

    test('should return 400 when originCityId is invalid (<1) - 0', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 0,
            destinationCityId: 2,
            data: '2026-03-10',
            hora: '10:00',
            cid: 1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Cidade de origem ou destino inválidos',
        });
    });

    test('should return 400 when destinationCityId is invalid (>134) - 135', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 1,
            destinationCityId: 135,
            data: '2026-03-10',
            hora: '10:00',
            cid: 1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Cidade de origem ou destino inválidos',
        });
    });

    test('should return 400 when destinationCityId is invalid !destinationCityId', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 1,
            data: '2026-03-10',
            hora: '10:00',
            cid: 1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Cidade de origem ou destino inválidos',
        });
    });

    test('should return 400 when destinationCityId is invalid (<1) - 0', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 1,
            destinationCityId: 0,
            data: '2026-03-10',
            hora: '10:00',
            cid: 1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'Cidade de origem ou destino inválidos',
        });
    });

    test('should return 400 when cid is invalid - []', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 1,
            destinationCityId: 2,
            data: '2026-03-10',
            hora: '10:00',
            cid: [],
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'CID inválido',
        });
    });

    test('should return 400 when cid is invalid (<0) -1', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 1,
            destinationCityId: 2,
            data: '2026-03-10',
            hora: '10:00',
            cid: -1,
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'CID inválido',
        });
    });

    test('should return 400 when cid is invalid !cid', async () => {
        const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
            originCityId: 1,
            destinationCityId: 2,
            data: '2026-03-10',
            hora: '10:00',
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            erro: 'CID inválido',
        });
    });

    describe('tests using mocks', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        test('should return 400 when cant find city by id', async () => {
            const getCityMock = jest.spyOn(GetCityByIdUseCase.prototype, 'execute');
            getCityMock.mockResolvedValue(null);
            const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
                originCityId: 1,
                destinationCityId: 133,
                data: '2026-03-10',
                hora: '10:00',
                cid: 1,
            });

            expect(getCityMock).toHaveBeenCalledTimes(2);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                erro: 'Rota não encontrada para as cidades informadas',
            });
        });

        test('should return 200 even if no route is found', async () => {
            const getCityMock = jest.spyOn(GetCityByIdUseCase.prototype, 'execute');
            getCityMock.mockResolvedValue(new City(1, 'testCity'));
            const getBusRoutesMock = jest.spyOn(GetBusRoutesUseCase.prototype, 'execute');
            getBusRoutesMock.mockResolvedValue([]);
            const getLineMock = jest.spyOn(GetLineUsecase.prototype, 'execute');
            getLineMock.mockResolvedValue([]);
            const createMock = jest.spyOn(PostgresRouteSearchDataSource.prototype, 'create');
            createMock.mockResolvedValue(undefined);

            const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
                originCityId: 1,
                destinationCityId: 133,
                data: '2026-03-10',
                hora: '10:00',
                cid: 1,
            });

            expect(getCityMock).toHaveBeenCalledTimes(2);
            expect(getBusRoutesMock).toHaveBeenCalledTimes(1);
            expect(getLineMock).toHaveBeenCalledTimes(1);
            expect(createMock).toHaveBeenCalledTimes(1);

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                allCids: [1],
                cidInfo: {
                    primaryCidUsed: 1,
                    totalCids: 1,
                },
                lines: [],
                primaryCid: 1,
            });
        });

        test('should return 500 when found some error', async () => {
            const getCityMock = jest.spyOn(GetCityByIdUseCase.prototype, 'execute');
            getCityMock.mockResolvedValue(new City(1, 'testCity'));
            const getBusRoutesMock = jest.spyOn(GetBusRoutesUseCase.prototype, 'execute');
            getBusRoutesMock.mockResolvedValue([]);
            const getLineMock = jest
                .spyOn(GetLineUsecase.prototype, 'execute')
                .mockRejectedValueOnce(new Error('exception'));

            const res = await request(busRoutes).post('/').set('Content-type', 'application/json').send({
                originCityId: 1,
                destinationCityId: 133,
                data: '2026-03-10',
                hora: '10:00',
                cid: 1,
            });

            expect(getCityMock).toHaveBeenCalledTimes(2);
            expect(getBusRoutesMock).toHaveBeenCalledTimes(1);
            expect(getLineMock).toHaveBeenCalledTimes(1);

            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                erro: 'Ocorreu um erro ao obter a linha informada',
            });
        });
    });
});

describe('get prymary cid', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 1 when sent cid is number 1', async () => {
        const result = await busController.getPrimaryCid(1);

        expect(result).toBe(1);
    });

    test('should return 1 when sent cid is array(1)', async () => {
        const getPrimaryAdaptionMock = jest.spyOn(getPrimaryAdaption, 'execute');
        getPrimaryAdaptionMock.mockResolvedValue(1);

        const result = await busController.getPrimaryCid([1]);

        expect(getPrimaryAdaptionMock).toHaveBeenCalledTimes(1);
        expect(result).toBe(1);
    });

    test('should return 3 when sent cid is array(1, 2, 3)', async () => {
        const getPrimaryAdaptionMock = jest.spyOn(getPrimaryAdaption, 'execute');
        getPrimaryAdaptionMock.mockResolvedValue(3);

        const result = await busController.getPrimaryCid([1, 2, 3]);

        expect(getPrimaryAdaptionMock).toHaveBeenCalledTimes(1);
        expect(result).toBe(3);
    });
});

describe('check route accessibility', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('checks if the field vehicle is corectly filled', async () => {
        const linha1 = {
            code: 'l1',
            origin: 'o1',
            destination: 'd1',
            lineHours: [],
            busStops: [],
            prefix: ['prefix1'],
            vehicle: null,
        };
        const linha2 = {
            code: 'l2',
            origin: 'o2',
            destination: 'd2',
            lineHours: [],
            busStops: [],
            prefix: ['prefix2'],
            vehicle: null,
        };

        const vehicle = {
            id: 1,
            prefix: 'carPrefix',
            group: 'carGroup',
            name: 'carName',
            accessibility: true,
        };

        const verifyAccessibilityMock = jest.spyOn(VerifyAccessibilityUseCase.prototype, 'execute');
        verifyAccessibilityMock.mockResolvedValue([vehicle]);

        await busController.checkRoutesAccessibility([linha1, linha2], 1);
        expect(verifyAccessibilityMock).toHaveBeenCalledTimes(2);

        expect(linha1.vehicle).toStrictEqual([vehicle]);
        expect(linha2.vehicle).toStrictEqual([vehicle]);
    });
});
