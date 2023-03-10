import BusRoute from "../busRoute";

interface IBusRepository {
  getRoute(origin: string, destination: string) : Promise<BusRoute[]>;
  getLines(route : BusRoute[]);
};

export { IBusRepository };