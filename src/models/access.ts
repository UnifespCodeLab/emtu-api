export default class Access {
  public id?: string;
  public readonly ip: string;
  public readonly data_acesso: string;

  constructor(ip: string, data_acesso: string, id?: string) {
    this.id = id;
    this.ip = ip;
    this.data_acesso = data_acesso;
  }
}