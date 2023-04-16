import { CityDto } from "../../dtos/cityDto";

export default interface ICityDataSource {
  getAll(): Promise<CityDto[]>;
}