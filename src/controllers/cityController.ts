import { PostgresCityDataSource } from "../database/db/city/postgresCityDataSource";
import CityRepository from "../models/repositories/implementations/CityRepository";
import { GetAllCitiesUseCase } from "../models/useCases/city/getAllCities";
import { Request, Response } from "express";

const cityDataSource = new PostgresCityDataSource();
const cityRepository = new CityRepository(cityDataSource);
const getAllCitiesUseCase = new GetAllCitiesUseCase(cityRepository);

export default class cityController {

  public static async getAllCities(req: Request, res: Response){
    try {
      const cities = await getAllCitiesUseCase.execute();
      return res.status(200).send(cities);
    } catch (error) {
      return res.status(500).send({ erro: "Erro ao obter dados" });
    }
  };

}

