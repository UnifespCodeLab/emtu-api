import { RouteSearchDto } from "../dtos/routeSearchDto";
import { InvalidParamError } from "../errors/invalidParamError";

export default class RouteSearch {
  public readonly idCidadeOrigem: number;
  public readonly idCidadeDestino: number;
  public readonly idCid: number;
  public readonly dataViagem: string;
  public readonly horaViagem: string;

  constructor(idCidadeOrigem: number, idCidadeDestino: number, idCid?: number, dataViagem?: string, horaViagem?: string) {
    this.idCidadeOrigem = idCidadeOrigem;
    this.idCidadeDestino = idCidadeDestino;
    this.idCid = idCid;
    this.dataViagem = dataViagem;
    this.horaViagem = horaViagem;
  };

  public static async validate(params: RouteSearchDto) {
    const missingParams = ['idCidadeOrigem', 'idCidadeDestino'].filter(
      requiredParam => !params[requiredParam]
    );

    if (missingParams.length === 0) return;

    throw new InvalidParamError(`Parâmetros obrigatórios não informados: ${missingParams}`);
  }
}
