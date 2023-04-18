import RouteSearch from "../../src/models/routeSearch";

describe('RouteSearch class', () => {
  test('should create an instance of ReportSearch with the correct properties', () => {
    const idCidadeOrigem = 1;
    const idCidadeDestino = 2;
    const idCid = 3;
    const dataViagem = '2023-11-05';
    const horaViagem = '17:45';

    const routeSearch = new RouteSearch(
      idCidadeOrigem,
      idCidadeDestino,
      idCid,
      dataViagem,
      horaViagem
    );

    expect(routeSearch.idCidadeOrigem).toBe(idCidadeOrigem);
    expect(routeSearch.idCidadeDestino).toBe(idCidadeDestino);
    expect(routeSearch.idCid).toBe(idCid);
    expect(routeSearch.dataViagem).toBe(dataViagem);
    expect(routeSearch.horaViagem).toBe(horaViagem);
  });
});
