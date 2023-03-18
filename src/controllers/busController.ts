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
import moment from "moment";

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
      let requestBody = req.body;
      if(!requestBody || Object.keys(requestBody).length === 0)
        return res.status(400).send({erro: "Objeto enviado é inválido"});
  
      const { idOriginCity, idDestinyCity, data, hora } = req.body;
      if(!idOriginCity || !idDestinyCity)
        return res.status(400).send({erro: "Cidade de origem ou destino inválidos"});
      if(idOriginCity < 1 || idOriginCity > 134 || idDestinyCity < 1 || idDestinyCity > 134)
        return res.status(400).send({erro: "Cidade de origem ou destino inválidos"});

      let originCity = await getCityByIdUseCase.execute(idOriginCity);
      let destinyCity = await getCityByIdUseCase.execute(idDestinyCity);

      if(!originCity || !destinyCity)
        return res.status(400).send({erro: "Rota não encontrada para as cidades informadas"});

      let routeIds = await getBusRoutesUseCase.execute(originCity.getName(), destinyCity.getName());

      await getLineUsecase.execute(routeIds, new Date(data), hora);
      
    } catch (error) {
      return res.status(500).send({erro: "Ocorreu um erro ao obter rota"});
    }
  }
}