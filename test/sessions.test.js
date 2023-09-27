/* import { expect } from 'chai';
import app from '../src/server.js';
import request from 'supertest';
import UserModel from '../src/DAO/models/user.model.js';

async function createUser() {
  const user = new UserModel({
    firstName: 'juan',
    lastName: 'juan',
    email: 'juan@juan.com',
    password: 'juan',
    role: 'user',
    age: 30,
    cartID: 'cart123',
  });

  return await user.save();
}

describe('Login', () => {
  it('debería permitir que un usuario inicie sesión con credenciales válidas', async () => {
    const user = await createUser();
    const res = await request(app).post('/login').send({
      email: user.email,
      password: user.password,
    });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('message', 'User logged in successfully');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.have.property('firstName', 'juan');
  });
  it('debería devolver un error al iniciar sesión con credenciales inválidas', async () => {
    const invalidLoginData = {
      email: 'usuario_invalido@example.com',
      password: 'contrasena_invalida',
    };

    const res = await request(app).post('/login').send(invalidLoginData);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error', 'Invalid Credentials');
  });
  after(async () => {
    await UserModel.deleteMany({ email: 'juan@example.com' });
  });
});
 */
