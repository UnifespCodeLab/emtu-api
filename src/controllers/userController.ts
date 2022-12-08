import {Request, Response} from "express";
import PasswordBcrypt from "../core/passwordBcrypt";
import { PostgresUserDataSource } from "../database/db/user/postgresUserDataSource";
import jwt from "jsonwebtoken";
import User from "../models/user";

const userDataSource = new PostgresUserDataSource();
const passwordEncrypter = new  PasswordBcrypt();

export default class UserController {
  public static async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;

      if(!(name && email && password)){
        return res.status(400).send({
          erro:"Parâmetros inválidos"
        });
      }

      const userExists  = await userDataSource.getByEmail(email);

      if(userExists){
        return res.status(409).send({
          erro:"Usuário já existe"
        });
      }

      const encryptedPassword = await passwordEncrypter.encrypt(password);

      const user = new User(name, email, encryptedPassword);

      const userData = await userDataSource.create(user);

      const token = jwt.sign(userData, 
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2h",
        });

      res.status(201).json({
        token: token
      });
    } catch (error) {
      return res.status(500).send({
        erro:"Falha ao cadastrar usuário"
      });
    }
  }
}