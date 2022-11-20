import { Router } from "express";
import { Request, Response } from "express";
import { PostgresCityDataSource } from "../database/db/city/postgresCityDataSource";
import CityRepository from "../models/repositories/implementations/CityRepository";
import { GetAllCitiesUseCase } from "../models/useCases/city/getAllCities";

const cityDataSource = new PostgresCityDataSource();
const cityRepository = new CityRepository(cityDataSource);
const getAllCitiesUseCase = new GetAllCitiesUseCase(cityRepository);

const cityRoutes = Router();

cityRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const cities = await getAllCitiesUseCase.execute();
    res.status(200).send(cities);
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao obter dados" });
  }
});

export { cityRoutes }

