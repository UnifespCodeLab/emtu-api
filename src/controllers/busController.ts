import { Request, Response } from "express";
import { busRouteDTO } from "../dtos/busRouteDto";
import { GetCityByIdUseCase } from './../models/useCases/city/getCityById';
import CityRepository from "../models/repositories/implementations/CityRepository";
import { PostgresCityDataSource } from "../database/db/city/postgresCityDataSource";
import PostgresBusDataSource from './../database/db/bus/postgresBusDataSource';
import BusRepository from "../models/repositories/implementations/BusRepository";
import { GetBusRoutesUseCase } from "../models/useCases/bus/getBusRoutes";
import AxiosBusExternal from "../external/axios/axiosBusExternal";
import GetLineUsecase from "../models/useCases/bus/getLine";

const cityDataSource = new PostgresCityDataSource();
const cityRepository = new CityRepository(cityDataSource);
const getCityByIdUseCase = new GetCityByIdUseCase(cityRepository);
const getBusRoutesService = new PostgresBusDataSource();
const busExternal = new AxiosBusExternal();
const getBusRoutesRepository = new BusRepository(getBusRoutesService, busExternal);
const getBusRoutesUseCase = new GetBusRoutesUseCase(getBusRoutesRepository);
const getLineUsecase = new GetLineUsecase(getBusRoutesRepository);

export default class busController {

  public static async getRoutes(req:Request<busRouteDTO>, res:Response) {
    try {
      if(!req.body || Object.keys(req.body).length === 0)
        return res.status(400).send({erro: "Objeto enviado é inválido"});
  
      const { originCityId, destinationCityId, data, hora } = req.body;
      if(!originCityId || !destinationCityId)
        return res.status(400).send({erro: "Cidade de origem ou destino inválidos"});
      if(originCityId < 1 || originCityId > 134 || destinationCityId < 1 || destinationCityId > 134)
        return res.status(400).send({erro: "Cidade de origem ou destino inválidos"});

      let originCity = await getCityByIdUseCase.execute(originCityId);
      let destinyCity = await getCityByIdUseCase.execute(destinationCityId);

      if(!originCity || !destinyCity)
        return res.status(400).send({erro: "Rota não encontrada para as cidades informadas"});

      let routeIds = await getBusRoutesUseCase.execute(originCity.getName(), destinyCity.getName());

      const lines = await getLineUsecase.execute(routeIds, new Date(data), new Date('1/1/1999 ' + hora));
      return res.status(200).send(lines);
    } catch (error) {
      return res.status(500).send({erro: "Ocorreu um erro ao obter rota"});
    }
  }
}