import supertest from 'supertest';
import chai from 'chai';
import app from '../src/server.js';
import ProductModel from '../src/DAO/models/product.model.js';
import CartModel from '../src/DAO/models/cart.model.js';

const expect = chai.expect;

const requester = supertest('http://localhost:8080');

describe('Carrito de compras', () => {
  let productoId;
  let carritoId;

  async function createProduct() {
    try {
      const productoDePrueba = new ProductModel({
        title: 'Producto de Prueba',
        description: 'Descripción del Producto de Prueba',
        price: 10,
        thumbnail: 'imagen_del_producto.jpg',
        code: '1001',
        stock: 10,
        category: 'Camisetas',
        status: true,
        owner: 'premium',
      });
      const productoGuardado = await productoDePrueba.save();
      productoId = productoGuardado._id;
    } catch (error) {
      console.error('Error al crear el producto de prueba:', error);
    }
  }

  async function loginUser(done) {
    const usuarioDePrueba = {
      firstName: 'Usuario',
      lastName: 'De Prueba',
      email: 'usuario@example.com',
      password: 'contraseña',
      role: 'premium',
    };
    try {
      await createProduct();
      const loginResponse = await requester.post('/api/sessions/login').send({
        email: usuarioDePrueba.email,
        password: usuarioDePrueba.password,
      });
      // Esperamos a que se reciba y procese la respuesta a la solicitud de inicio de sesión.
      await loginResponse;
      done(usuarioDePrueba);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      done(error);
    }
  }

  before(function (done) {
    loginUser(() => {
      console.log('Usuario logueado con éxito');

      const carritoDePrueba = new CartModel({
        products: [
          {
            product: productoId,
            quantity: 1,
          },
        ],
      });

      carritoDePrueba.save((error, carritoGuardado) => {
        if (error) {
          console.error('Error al crear el carrito de prueba:', error);
          done(error);
        } else {
          console.log('Carrito de prueba creado con éxito');

          carritoId = carritoGuardado._id;
          done();
        }
      });
    });
  });

  it('Debería agregar un producto al carrito', async (done) => {
    jest.setTimeout(10000);

    const res = await requester.post(`/api/carts/${carritoId}/product/${productoId}`);
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('message').equal('Producto agregado al carrito con éxito');
    done();
  });
});
