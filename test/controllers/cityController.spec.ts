import request from 'supertest';
import cityController from "../../src/controllers/cityController";
import express from "express";

const cityRoutes = express();

cityRoutes.get('/', cityController.getAllCities);
cityRoutes.get('/:idCity', cityController.getCityById);

describe("get city by id", () => {
  test("should return 400 when passing an invalid id", async() => {
    const res = await request(cityRoutes).get('/0');
    expect(res.statusCode).toBe(400);
  });

  test("should an error message when passing an invalid id", async() => {
    const res = await request(cityRoutes).get('/0');
    expect(JSON.parse(res.text).erro).toBe("ID inválido");
  });

  test("should return 200 when passing an valid id", async() => {
    const res = await request(cityRoutes).get('/1');
    expect(res.statusCode).toBe(200);
  });

});