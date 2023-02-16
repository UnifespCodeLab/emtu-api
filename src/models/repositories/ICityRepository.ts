import { CityDto } from "../../dtos/cityDto";

interface ICityRepository {
  getAll() : Promise<CityDto[]>;
  getById(cityId) : Promise<CityDto>;
}

export { ICityRepository };