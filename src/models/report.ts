export default class Report {
  public readonly email: string;
  public readonly idCidadeOrigem: number;
  public readonly idCidadeDestino: number;
  public readonly idCid: number;

  constructor(email: string, idCidadeOrigem: number, idCidadeDestino: number, idCid: number) {
    this.email = email;
    this.idCidadeOrigem = idCidadeOrigem;
    this.idCidadeDestino = idCidadeDestino;
    this.idCid = idCid;
  };
}
