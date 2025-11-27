import {Request, Response} from "express";
import PasswordBcrypt from "../core/passwordBcrypt";
import tokenJWT from "../core/tokenJWT";
import { PostgresUserDataSource } from "../database/db/user/postgresUserDataSource";
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

      const createUserSuccess = await userDataSource.create(user);

      if(!createUserSuccess) return res.status(500).send({erro:"Falha ao cadastrar usuário"});

      const token = tokenJWT.create({
        "name": user.name,
        "email": user.email,
        "password": user.password
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

  public static async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if(!(email && password)){
        return res.status(400).send({
          erro:"Não foram enviados todos os parâmetros obrigatórios"
        });
      }

      const user  = await userDataSource.getByEmail(email);
      const isPasswordValid = user ?
        await passwordEncrypter.isValid(password, user.password)
        : null;

      if(!user || !isPasswordValid) {
        return res.status(400).send({
          erro:"Parâmetros inválidos"
        });
      };

      const userData = {
        "name": user.name,
        "email": user.email,
        "password": user.password,
      };

      const token = tokenJWT.create(userData);

      return res.status(201).json({
        token: token
      });

    } catch (error) {
      return res.status(500).send({
        erro:"Falha ao efetuar o login do usuário"
      });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await userDataSource.getAll();

      if(!users) {
        return res.status(404).send({
          erro: "Nenhum usuário encontrado"
        });
      }

      const usersWithoutPassword = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email
      }));

      return res.status(200).json(usersWithoutPassword);

    } catch (error) {
      return res.status(500).send({
        erro: "Falha ao buscar usuários"
      });
    }
  }

  public static async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if(!id) {
        return res.status(400).send({
          erro: "ID não informado"
        });
      }

      const user = await userDataSource.getById(id);

      if(!user) {
        return res.status(404).send({
          erro: "Usuário não encontrado"
        });
      }

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      return res.status(200).json(userWithoutPassword);

    } catch (error) {
      return res.status(500).send({
        erro: "Falha ao buscar usuário"
      });
    }
  }

  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      if(!id) {
        return res.status(400).send({
          erro: "ID não informado"
        });
      }

      const userExists = await userDataSource.getById(id);

      if(!userExists) {
        return res.status(404).send({
          erro: "Usuário não encontrado"
        });
      }

      if(email && email !== userExists.email) {
        const emailInUse = await userDataSource.getByEmail(email);
        if(emailInUse && emailInUse.id !== id) {
          return res.status(409).send({
            erro: "Email já está em uso"
          });
        }
      }

      const updatedName = name || userExists.name;
      const updatedEmail = email || userExists.email;
      let updatedPassword = password ? await passwordEncrypter.encrypt(password) : userExists.password;

      const updatedUser = new User(updatedName, updatedEmail, updatedPassword);
      updatedUser.id = id;

      const updateSuccess = await userDataSource.update(updatedUser);

      if(!updateSuccess) {
        return res.status(500).send({
          erro: "Falha ao atualizar usuário"
        });
      }

      return res.status(200).json({
        mensagem: "Usuário atualizado com sucesso",
        usuario: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email
        }
      });

    } catch (error) {
      return res.status(500).send({
        erro: "Falha ao atualizar usuário"
      });
    }
  }

}