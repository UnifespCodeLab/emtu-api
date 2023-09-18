export type RouteSearchDto = {
  idCidadeOrigem: number,
  idCidadeDestino: number,
  idLinha?: string,
  sucedida: boolean,
  idCid: number,
  dataViagem: string,
  horaViagem: string,
  dataCriacao: Date
};
