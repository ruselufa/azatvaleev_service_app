import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	// it('Register - ok', async () => {
	// 	const res = await request(application.app).post('/users/register').send({
	// 		name: 'Vasya',
	// 		email: 'a6@a.ru',
	// 		password: 'asdf',
	// 	});
	// 	// не пройдет, нужно новый имейл создать, т.к. пользователь создан в пред тесте
	// 	expect(res.statusCode).toBe(200);
	// });

	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send({
			name: 'Vasya',
			email: 'a5@a.ru',
			password: 'asdf',
		});
		expect(res.statusCode).toBe(422);
	});

	it('Login.simple - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'a5@a.ru',
			password: 'asdf',
		});
		expect(res.statusCode).toBe(200);
	});

	it('Login.jwt - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'a5@a.ru',
			password: 'asdf',
		});
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login.simple - error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'a5@a.ru',
			password: '1',
		});
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'a5@a.ru',
			password: 'asdf',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		// хз почему, но payload выходит всегда undefined
		expect(res.body.email).toBe('a5@a.ru');
	});

	it('Info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
