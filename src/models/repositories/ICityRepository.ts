import { CityDto } from "../../dtos/cityDto";

interface ICityRepository {
  getAll() : Promise<CityDto[]>;
}

export { ICityRepository };