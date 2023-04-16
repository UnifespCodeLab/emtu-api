import { ReportDto } from "../dtos/reportDto";
import { InvalidParamError } from "../errors/invalidParamError";
import Email from "./email";

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

  public static async validate(params: ReportDto) {
    this.validateRequiredParams(params);
    this.validateEmail(params.email);
    this.validateCities(params.idCidadeOrigem, params.idCidadeDestino);
  }

  private static validateRequiredParams(params: ReportDto) {
    const missingParams = ['email', 'idCidadeOrigem', 'idCidadeDestino', 'idCid'].filter(
      requiredParam => !params[requiredParam]
    );

    if (missingParams.length === 0) return;

    throw new InvalidParamError(`Parâmetros obrigatórios não informados: ${missingParams}`);
  }

  private static validateEmail(email: string) {
    if (Email.validate(email)) return;

    throw new InvalidParamError(`E-mail informado é inválido: ${email}`);
  }

  private static validateCities(idCidadeOrigem: number, idCidadeDestino: number) {
    if (idCidadeOrigem !== idCidadeDestino) return;

    throw new InvalidParamError('As cidades de origem e destino não podem ser iguais');
  }
}
