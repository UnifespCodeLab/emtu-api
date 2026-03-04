import request from 'supertest';
import express from 'express';

// importa o controller REAL
import UserController from '../../src/controllers/userController';

// ---- MOCKS DAS DEPENDÊNCIAS DO CONTROLLER ----
jest.mock('../../src/database/db/user/postgresUserDataSource');
jest.mock('../../src/core/passwordBcrypt');
jest.mock('../../src/core/tokenJWT');

import { PostgresUserDataSource } from '../../src/database/db/user/postgresUserDataSource';
import PasswordBcrypt from '../../src/core/passwordBcrypt';
import tokenJWT from '../../src/core/tokenJWT';
import User from '../../src/models/user';

describe('UserController.login', () => {
    let app: express.Express;
    let mockDataSource: jest.Mocked<PostgresUserDataSource>;
    let mockPassword: jest.Mocked<PasswordBcrypt>;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.post('/login', UserController.login);

        mockDataSource = new PostgresUserDataSource() as jest.Mocked<PostgresUserDataSource>;
        mockPassword = new PasswordBcrypt() as jest.Mocked<PasswordBcrypt>;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna 400 quando não envia senha', async () => {
        const response = await request(app).post('/login').send({ email: 'a@a.com' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Não foram enviados todos os parâmetros obrigatórios',
        });
    });

    it('retorna 400 quando não envia email', async () => {
        const response = await request(app).post('/login').send({ password: 'password' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Não foram enviados todos os parâmetros obrigatórios',
        });
    });

    it('retorna 400 quando não encontra user', async () => {
        const spyGetByEmail = jest.spyOn(PostgresUserDataSource.prototype, 'getByEmail').mockResolvedValue(null);

        const response = await request(app).post('/login').send({ email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Parâmetros inválidos',
        });
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');
    });

    it('retorna 400 quando a senha não é válida', async () => {
        const spyGetByEmail = jest.spyOn(PostgresUserDataSource.prototype, 'getByEmail').mockResolvedValue({
            name: 'Test',
            email: 'test@mail.com',
            password: 'hashed',
        });

        mockPassword.isValid.mockResolvedValue(false);
        const spyIsValid = jest.spyOn(PasswordBcrypt.prototype, 'isValid').mockResolvedValue(false);

        const response = await request(app).post('/login').send({ email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Parâmetros inválidos',
        });
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');
        expect(spyIsValid).toHaveBeenCalledTimes(1);
    });

    it('retorn 500 quando acontece alguma exceção', async () => {
        const spyGetByEmail = jest
            .spyOn(PostgresUserDataSource.prototype, 'getByEmail')
            .mockRejectedValue(new Error('Database error'));

        const response = await request(app).post('/login').send({ email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            erro: 'Falha ao efetuar o login do usuário',
        });
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');
    });

    it('retorna 201 quando login é efetuado', async () => {
        const spyGetByEmail = jest.spyOn(PostgresUserDataSource.prototype, 'getByEmail').mockResolvedValue({
            name: 'Test',
            email: 'test@mail.com',
            password: 'hashed',
        });

        jest.spyOn(PasswordBcrypt.prototype, 'isValid').mockResolvedValue(true);

        (tokenJWT.create as jest.Mock).mockReturnValue('TOKEN123');

        const response = await request(app).post('/login').send({ email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(201);
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');
    });
});

describe('UserController.register', () => {
    let app: express.Express;
    let mockDataSource: jest.Mocked<PostgresUserDataSource>;
    let mockPassword: jest.Mocked<PasswordBcrypt>;

    beforeAll(() => {
        app = express();
        app.use(express.json());

        app.post('/register', UserController.register);

        mockDataSource = new PostgresUserDataSource() as jest.Mocked<PostgresUserDataSource>;
        mockPassword = new PasswordBcrypt() as jest.Mocked<PasswordBcrypt>;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna 400 quando não envia name', async () => {
        const response = await request(app).post('/register').send({ email: 'a@a.com', password: 'password' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Parâmetros inválidos',
        });
    });

    it('retorna 400 quando não envia email', async () => {
        const response = await request(app).post('/register').send({ name: 'Test', password: 'password' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Parâmetros inválidos',
        });
    });

    it('retorna 400 quando não envia senha', async () => {
        const response = await request(app).post('/register').send({ name: 'Test', email: 'a@a.com' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            erro: 'Parâmetros inválidos',
        });
    });

    it('retorna 409 quando user já exite', async () => {
        const spyGetByEmail = jest.spyOn(PostgresUserDataSource.prototype, 'getByEmail').mockResolvedValue({
            name: 'Test',
            email: 'test@mail.com',
            password: 'hashed',
        });

        const response = await request(app)
            .post('/register')
            .send({ name: 'Test', email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
            erro: 'Usuário já existe',
        });
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');
    });

    it('retorna 500 quando acontece erro ao salvar no banco', async () => {
        const spyGetByEmail = jest.spyOn(PostgresUserDataSource.prototype, 'getByEmail').mockResolvedValue(null);

        const spyEncrypt = jest.spyOn(PasswordBcrypt.prototype, 'encrypt').mockResolvedValue('hashed');

        const spyCreate = jest.spyOn(PostgresUserDataSource.prototype, 'create').mockResolvedValue(null);
        const response = await request(app)
            .post('/register')
            .send({ name: 'Test', email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            erro: 'Falha ao cadastrar usuário',
        });
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');

        expect(spyEncrypt).toHaveBeenCalledTimes(1);

        const mockUser = new User('Test', 'test@mail.com', 'hashed');
        expect(spyCreate).toHaveBeenCalledWith(mockUser);
        expect(spyCreate).toHaveBeenCalledTimes(1);
    });

    it('retorn 500 quando acontece alguma exceção', async () => {
        const spyGetByEmail = jest
            .spyOn(PostgresUserDataSource.prototype, 'getByEmail')
            .mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/register')
            .send({ name: 'Test', email: 'test@mail.com', password: '123' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            erro: 'Falha ao cadastrar usuário',
        });
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');
    });

    it('retorna 201 quando a criação é efetuada', async () => {
        const spyGetByEmail = jest.spyOn(PostgresUserDataSource.prototype, 'getByEmail').mockResolvedValue(null);

        const spyEncrypt = jest.spyOn(PasswordBcrypt.prototype, 'encrypt').mockResolvedValue('hashed');

        const spyCreate = jest.spyOn(PostgresUserDataSource.prototype, 'create').mockResolvedValue({
            rows: [{ name: 'Test', email: 'test@mail.com', password: 'hashed' }],
        } as any);

        const response = await request(app)
            .post('/register')
            .send({ name: 'Test', email: 'test@mail.com', password: '123' });

        (tokenJWT.create as jest.Mock).mockReturnValue('TOKEN123');

        expect(response.status).toBe(201);
        expect(spyGetByEmail).toHaveBeenCalledTimes(1);
        expect(spyGetByEmail).toHaveBeenCalledWith('test@mail.com');

        expect(spyEncrypt).toHaveBeenCalledTimes(1);

        const mockUser = new User('Test', 'test@mail.com', 'hashed');
        expect(spyCreate).toHaveBeenCalledWith(mockUser);
        expect(spyCreate).toHaveBeenCalledTimes(1);
    });
});
