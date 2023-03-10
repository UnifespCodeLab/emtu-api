
import BusRepository from './../../../src/models/repositories/implementations/BusRepository';
import PostgresBusDataSource from './../../../src/database/db/bus/postgresBusDataSource';
const busDataSource = new PostgresBusDataSource();
const busRepository = new BusRepository(busDataSource);

const expected = [
  {
    routeShortName: '139',
    routeNameStart: 'SAO PAULO (SAO MIGUEL PAULISTA)',
    routeNameEnd: 'GUARULHOS (TERMINAL METROPOLITANO CECAP)',
    routeType: 3,
  },
  {
    routeShortName: '825',
    routeNameStart: 'SAO PAULO (SAO MIGUEL PAULISTA)',
    routeNameEnd: 'GUARULHOS (CENTRO)',
    routeType: 3,
  },
];

describe('BusRepository', () => {
  describe('getRoute', () => {
    test('should return null for invalid origin or destination', async () => {
      expect(await busRepository.getRoute('', '')).toBe(null);
    });

    test('should return an array of routes for valid origin and destination', async () => {

    const controllerResult = await busRepository.getRoute('Sao paulo', 'Guarulhos');
    expect(controllerResult).toEqual(expected);
    });
  });
});