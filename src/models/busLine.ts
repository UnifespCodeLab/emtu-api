
export default class BusLine {
  codigo: string;
  cidade_origem: string;
  cidade_destino: string;
  horarios: Date[];
  horariosdiasuteis: Date[];
  horariossabados: Date[];
  horariosdomingosferiados: Date[];
  prefixo: string[];

  constructor(codigo: string,cidade_origem: string,cidade_destino: string,
    horarios: Date[],
    horariosdiasuteis: Date[],
    horariossabados: Date[],
    horariosdomingosferiados: Date[],
    prefixo: string[]
    ){
    this.codigo = codigo;
    this.cidade_origem = cidade_origem;
    this.cidade_destino = cidade_destino;
    this.horarios = horarios;
    this.horariosdiasuteis = horariosdiasuteis;
    this.horariossabados = horariossabados;
    this.horariosdomingosferiados = horariosdomingosferiados;
    this.prefixo = prefixo;
  }

  static fromJson(obj: any): BusLine[]{
    let lineDetails: BusLine[] = [];
    obj.map(route => {
      let busLine = new BusLine(
        route.data.linhas[0].codigo,
        route.data.linhas[0].rotas[0].cidade,
        route.data.linhas[0].rotas[0].destino,
        route.data.linhas[0].rotas[0].horarios.split(',').map(hour => new Date('1/1/1999 ' + hour)),
        route.data.linhas[0].rotas[0].horariosdiasuteis.split(',').map(hour => new Date('1/1/1999 ' + hour)),
        route.data.linhas[0].rotas[0].horariossabados.split(',').map(hour => new Date('1/1/1999 ' + hour)),
        route.data.linhas[0].rotas[0].horariosdomingosferiados.split(',').map(hour => new Date('1/1/1999 ' + hour)),
        route.data.linhas[0].veiculos.map(veiculo => veiculo.prefixo)
        );

      lineDetails.push(busLine);
    });

    return lineDetails;
  }
}