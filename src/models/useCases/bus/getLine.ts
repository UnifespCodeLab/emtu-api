import BusRoute from "../../busRoute";
import { IBusRepository } from "../../repositories/IBusRepository";
import { IGetLine } from "./interfaces/IGetLine";
import BusLine from "../../busLine";
import moment from "moment";
import { BusLineDto } from "../../../dtos/busLineDto";

export default class GetLineUsecase implements IGetLine {
  constructor(getBusRoutesRepository: IBusRepository) {
    this.getBusRoutesRepository = getBusRoutesRepository;
  }
  getBusRoutesRepository: IBusRepository;
  async execute(busRoute: BusRoute[], date: Date, hour: Date): Promise<BusLineDto[]> {
    try {
      let routes = await this.getBusRoutesRepository.getLines(busRoute);
      let lineDetails: BusLine[];
      let lines: BusLineDto[] = [];
      if (routes == null) return lines;

      lineDetails = BusLine.fromJson(routes);

      const dayOfWeek = date.getDay();
      
      lineDetails.forEach((line) => {
        lines.push({
          code: line.codigo,
          origin: line.cidade_origem,
          destination: line.cidade_destino,
          lineHours: this.getHours(dayOfWeek, line, hour),
          accessibility: false
        })

      });

      return lines;
    } catch (error) {
      console.log(error);
    }
  }

  getHours(dayOfWeek: number, line: BusLine, requestHour): Date[] {
    if (dayOfWeek > 0 && dayOfWeek < 7 && line.horariosdiasuteis.length > 1) // dias uteis
      return line.horariosdiasuteis.filter(hour => hour >= requestHour)
    if (dayOfWeek == 7 && line.horariossabados.length > 1) // sábado
      return line.horariossabados.filter(hour => hour >= requestHour)
    if (dayOfWeek == 0 && line.horariosdomingosferiados.length > 1) // domingo
      return line.horariosdomingosferiados.filter(hour => hour >= requestHour)
    return line.horarios.filter(hour => hour >= requestHour);
  }
}

