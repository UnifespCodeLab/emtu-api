
export default class BusLine {
  codigo: string;
  cidade_origem: string;
  cidade_destino: string;
  horarios: Date[];
  pontos: string[];
  horariosdiasuteis: Date[];
  horariossabados: Date[];
  horariosdomingosferiados: Date[];
  prefixo: string[];

  constructor(codigo: string,cidade_origem: string,cidade_destino: string,
    horarios: Date[],
    pontos: string[],
    horariosdiasuteis: Date[],
    horariossabados: Date[],
    horariosdomingosferiados: Date[],
    prefixo: string[]
    ){
    this.codigo = codigo;
    this.cidade_origem = cidade_origem;
    this.cidade_destino = cidade_destino;
    this.horarios = horarios;
    this.pontos = pontos;
    this.horariosdiasuteis = horariosdiasuteis;
    this.horariossabados = horariossabados;
    this.horariosdomingosferiados = horariosdomingosferiados;
    this.prefixo = prefixo;
  }

  static fromJson(obj: any): BusLine[]{

    let lineDetails: BusLine[] = [];
    obj.filter(route=> route.data.linhas.length > 0).map(route => {
        let lines = route.data.linhas[0];
        let lineRoutes = lines.rotas[0];

        let busLine = new BusLine(
          lines.codigo,
          lineRoutes.cidade,
          lineRoutes.destino,
          lineRoutes.horarios.split(',').map(hour => new Date('1/1/1999 ' + hour)),
          lineRoutes.pontos,
          lineRoutes.horariosdiasuteis.split(',').map(hour => new Date('1/1/1999 ' + hour)),
          lineRoutes.horariossabados.split(',').map(hour => new Date('1/1/1999 ' + hour)),
          lineRoutes.horariosdomingosferiados.split(',').map(hour => new Date('1/1/1999 ' + hour)),
          lines.veiculos.map(veiculo => veiculo.prefixo)
          );

        lineDetails.push(busLine);
    });

    return lineDetails;
  }
}
