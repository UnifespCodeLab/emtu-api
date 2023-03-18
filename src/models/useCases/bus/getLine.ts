import { AxiosResponse } from "axios";
import BusRoute from "../../busRoute";
import { IBusRepository } from "../../repositories/IBusRepository";
import { IGetLine } from "./interfaces/IGetLine";

export default class GetLineUsecase implements IGetLine {
  constructor(getBusRoutesRepository: IBusRepository) {
    this.getBusRoutesRepository = getBusRoutesRepository;
  }
  getBusRoutesRepository: IBusRepository;
  async execute(busRoute: BusRoute[], date: Date, hour: Date): Promise<any> {
    try {
      let routes = await this.getBusRoutesRepository.getLines(busRoute);
      if (routes == null) return routes;
      let lineDetails = [];
      routes.map(route => {
        lineDetails.push({
          linha: {
            codigo: route.data.linhas[0].codigo,
            cidade_origem: route.data.linhas[0].rotas[0].cidade,
            cidade_destino: route.data.linhas[0].rotas[0].destino,
            horarios: route.data.linhas[0].rotas[0].horarios,
            horariosdiasuteis: route.data.linhas[0].rotas[0].horariosdiasuteis,
            horariossabados: route.data.linhas[0].rotas[0].horariossabados,
            horariosdomingosferiados: route.data.linhas[0].rotas[0].horariosdomingosferiados,
          }
        })
      });

      const dayOfWeek = date.getDay();

    } catch (error) {
      console.log(error);
    }
  }

}

