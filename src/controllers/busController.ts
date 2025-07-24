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
import { VerifyAccessibilityUseCase } from "../models/useCases/vehicles/verifyAccessibilityUseCase";
import { VehicleRepository } from './../models/repositories/implementations/VehicleRepository';
import { PostgresVehicleDatasource } from './../database/db/vehicle/postgresVehicleDatasource';
import CidsRepository from "../models/repositories/implementations/CidsRepository";
import { PostgresCidsDataSource } from "../database/db/cids/potsgresCidsDataSource";
import { BusLineDto } from "../dtos/busLineDto";
import { RouteSearchDto } from "../dtos/routeSearchDto";
import { PostgresRouteSearchDataSource } from "../database/db/routeSearch/postgresRouteSearchDataSource";
import BusRoute from "../models/busRoute";
import { getPrimaryAdaption } from "../utils/cidUtils";

const cityDataSource = new PostgresCityDataSource();
const cityRepository = new CityRepository(cityDataSource);
const getCityByIdUseCase = new GetCityByIdUseCase(cityRepository);
const getBusRoutesService = new PostgresBusDataSource();
const busExternal = new AxiosBusExternal();
const getBusRoutesRepository = new BusRepository(getBusRoutesService, busExternal);
const getBusRoutesUseCase = new GetBusRoutesUseCase(getBusRoutesRepository);
const getLineUsecase = new GetLineUsecase(getBusRoutesRepository);
const vehicleDatasource = new PostgresVehicleDatasource();
const vehicleRepository = new VehicleRepository(vehicleDatasource);
const cidsDatasource = new PostgresCidsDataSource();
const cidsRepository = new CidsRepository(cidsDatasource);
const verifyAccessibilityUseCase = new VerifyAccessibilityUseCase(vehicleRepository, cidsRepository);
const routeSearchDataSource = new PostgresRouteSearchDataSource();

export default class busController {

  private static async getBusRoutes(body) {
    try {
      if(!body || Object.keys(body).length === 0)
        throw({status: 400, message: "Objeto enviado é inválido"})
  
      const { originCityId, destinationCityId, data, hora, cid } = body;
      if(!originCityId || !destinationCityId)
        throw({status: 400, message: "Cidade de origem ou destino inválidos"})

      if(originCityId < 1 || originCityId > 134 || destinationCityId < 1 || destinationCityId > 134)
        throw({status: 400, message: "Cidade de origem ou destino inválidos"})
      
      if(!cid || (Array.isArray(cid) && cid.length === 0) || (!Array.isArray(cid) && cid <= 0))
        throw({status: 400, message: "CID inválido"})

      let originCity = await getCityByIdUseCase.execute(originCityId);
      let destinyCity = await getCityByIdUseCase.execute(destinationCityId);

      if(!originCity || !destinyCity)
        throw({status: 400, message: "Rota não encontrada para as cidades informadas"})

      let routeIds = await getBusRoutesUseCase.execute(originCity.getName(), destinyCity.getName());
      if (routeIds == null){
        routeIds = await getBusRoutesUseCase.execute(destinyCity.getName() , originCity.getName() );
      }

      const [year, month, day] = data.split('-');
      const lines = await getLineUsecase.execute(
        routeIds,
        new Date(+year, +month - 1, +day),
         new Date('1/1/1999 ' + hora),
         originCity.getName(),
         destinyCity.getName()
        );    
      
      const primaryCid = await busController.getPrimaryCid(cid);
      await busController.checkRoutesAccessibility(lines, primaryCid);
      return {routeIds, lines, primaryCid, allCids: Array.isArray(cid) ? cid : [cid]}
    } catch (error) {
      if (error.status) {
        throw(error)
      } else {
        console.log(error)
        throw({status: 500, message: "Ocorreu um erro ao obter a linha informada"})
      }
    }
  }

  static async getPrimaryCid(cid): Promise<number> {
    // Se é só um CID, retorna ele diretamente
    if (!Array.isArray(cid)) {
      return cid;
    }
    
    // Se múltiplos CIDs, seleciona o com maior grau de adaptação
    try {
      const primaryCid = await getPrimaryAdaption.execute(cid);
      return primaryCid;
    } catch (error) {
      console.log("Error getting primary CID:", error);
      return cid[0];
    }
  }

  static async saveRouteSearch(body, routes:BusRoute[], lines:BusLineDto[]) {
    const { originCityId, destinationCityId, data, hora, cid } = body
    
    let searchBody: RouteSearchDto[] = []
    const currentDate = new Date().toISOString()

    const cidsToSave = Array.isArray(cid) ? cid : [cid];

    if (routes && routes.length) {
      routes.forEach(route => {
        cidsToSave.forEach(cidValue => {
          searchBody.push({
            idCidadeOrigem: originCityId,
            idCidadeDestino: destinationCityId,
            idCid: cidValue,
            idLinha: route.routeShortName,
            sucedida: Boolean(lines.find(line => line.code == route.routeShortName)),
            dataViagem: data,
            horaViagem: hora,
            dataCriacao: currentDate
          });
        });
      });
    } else {
      cidsToSave.forEach(cidValue => {
        searchBody.push({
          idCidadeOrigem: originCityId,
          idCidadeDestino: destinationCityId,
          idCid: cidValue,
          sucedida: false,
          dataViagem: data,
          horaViagem: hora,
          dataCriacao: currentDate
        });
      });
    }

    try {
      searchBody.forEach(async item => 
        await routeSearchDataSource.create(item)
      )
  
    } catch(error) {
      console.log("Erro ao salvar busca:", error)
    }
  }

  public static async getRoutes(req:Request<busRouteDTO>, res:Response) {
    let routeIds, lines, primaryCid, allCids
    
    try {
      const result = await busController.getBusRoutes(req.body)
      routeIds = result.routeIds
      lines = result.lines
      primaryCid = result.primaryCid
      allCids = result.allCids
    }
    catch(error) {
      return res.status(error.status).send({erro: error.message});
    }
    await busController.saveRouteSearch(req.body, routeIds, lines)
    
    return res.status(200).send({
      lines,
      primaryCid,
      allCids,
      cidInfo: {
        totalCids: allCids.length,
        primaryCidUsed: primaryCid
      }
    });
  }

  static async checkRoutesAccessibility(lines: BusLineDto[], cid: number) : Promise<void> {
    let linePos: number;
    for(linePos=0; linePos < lines.length; linePos++) {
      let line = lines[linePos];
      line.vehicle = await verifyAccessibilityUseCase.execute(line.prefix, cid);
    } 
  }
}