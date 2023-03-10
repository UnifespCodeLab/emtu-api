import IBusDataSource from "../../../database/interfaces/busDataSource";
import BusRoute from "../../busRoute";
import { IBusRepository } from "../IBusRepository";

export default class BusRepository implements IBusRepository {
  busDataSource: IBusDataSource;
  constructor(busDataSource: IBusDataSource){
    this.busDataSource = busDataSource;
  }

  async getRoute(origin: string, destination: string): Promise<BusRoute[]> {
    try {
      if(!origin || !destination)
        return null;
      return await this.busDataSource.getRoute(origin, destination);
    } catch (error) {
      throw(error);
    }
  }

}