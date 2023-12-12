import supertest from 'supertest';
import server, { app } from '../index';
import MovieModel from '../model/movie.model';
import UserModel from '../model/user.model';
import { faker } from '@faker-js/faker';
import authenticate from '../auth/auth.middleware';


const moviesEndpoint = '/movies';
const loginEndpoint = '/login';


afterAll((done) => {
    server.close((err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Server closed');
        }
        done();
    });
});

describe("Integration test", () => {
    describe('Movie API', () => {
        const testUser = { username: faker.internet.userName(), password: faker.internet.password(), role: 'admin' };
        it('should return a valid JWT token on user login', async () => {
            await UserModel.create(testUser);
            const response = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password })
                .expect(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should return a list of movies', async () => {
            const response = await supertest(app)
                .get(moviesEndpoint)
                .expect(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return an array of movies for a valid search query', async () => {
            const testData = [
                { title: 'Movie1', genre: 'Action', rating: 3.4, streamingLink: "https://imdb.com/33/" },
                { title: 'Movie2', genre: 'Drama', rating: 5.6, streamingLink: "https://imdb.com/dummy" },
            ];
            await MovieModel.insertMany(testData);

            const response = await supertest(app)
                .get(`/search?q=Action`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
        });

        it('should return a 500 Internal Server Error for a failed search operation', async () => {
            jest.spyOn(MovieModel, 'find').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            const response = await supertest(app)
                .get(`/search?q=Action`)
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        });

        it('should create a new movie with valid authentication', async () => {
            const loginResponse = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password });

            const response = await supertest(app)
                .post(moviesEndpoint)
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .send({ title: 'New Movie', genre: 'Action', rating: 9.0, streamingLink: 'https://example.com' })
                .expect(200);

            expect(response.body).toHaveProperty('title', 'New Movie');
        });

        it('should update an existing movie with valid authentication', async () => {
            const loginResponse = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password });

            const testMovie = { title: 'Update Movie', genre: 'Drama', rating: 8.5, streamingLink: 'https://example.com' };
            const savedMovie = await MovieModel.create(testMovie);

            const updateResponse = await supertest(app)
                .put(`${moviesEndpoint}/${savedMovie._id}`)
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .send({ title: 'Updated Movie' })
                .expect(200);


            expect(updateResponse.body).toHaveProperty('title', 'Updated Movie');
        });


        it('should delete an existing movie with valid authentication', async () => {

            const loginResponse = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password });


            const testMovie = { title: 'Delete Movie', genre: 'Comedy', rating: 7.5, streamingLink: 'https://example.com' };
            const savedMovie = await MovieModel.create(testMovie);

            const deleteResponse = await supertest(app)
                .delete(`${moviesEndpoint}/${savedMovie._id}`)
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .expect(200);

            expect(deleteResponse.body).toHaveProperty('message', 'Movie deleted successfully');

            const deletedMovie = await MovieModel.findById(savedMovie._id);
            expect(deletedMovie).toBeNull();
        });
        it('should return a 500 Internal Server Error when getting movies encounters an issue', async () => {
            jest.spyOn(MovieModel, 'find').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            const response = await supertest(app)
                .get(moviesEndpoint)
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        });

        it('should return a 500 Internal Server Error when creating a new movie encounters an issue', async () => {
            const loginResponse = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password });

            jest.spyOn(MovieModel, 'create').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            const response = await supertest(app)
                .post(moviesEndpoint)
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .send({ title: 'New Movie', genre: 'Action', rating: 9.0, streamingLink: 'https://example.com' })
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        });

        it('should return a 500 Internal Server Error when updating an existing movie encounters an issue', async () => {
            const loginResponse = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password });

            const testMovie = { title: 'Update Movie', genre: 'Drama', rating: 8.5, streamingLink: 'https://example.com' };
            const savedMovie = await MovieModel.create(testMovie);

            jest.spyOn(MovieModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            const response = await supertest(app)
                .put(`${moviesEndpoint}/${savedMovie._id}`)
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .send({ title: 'Updated Movie' })
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        });

        it('should return a 500 Internal Server Error when deleting an existing movie encounters an issue', async () => {
            const loginResponse = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password });

            const testMovie = { title: 'Delete Movie', genre: 'Comedy', rating: 7.5, streamingLink: 'https://example.com' };
            const savedMovie = await MovieModel.create(testMovie);

            jest.spyOn(MovieModel, 'findByIdAndDelete').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            const response = await supertest(app)
                .delete(`${moviesEndpoint}/${savedMovie._id}`)
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        });
    });


    describe('Auth Controller', () => {
        it('should return a valid JWT token on successful user login', async () => {
            const testUser = { username: faker.internet.userName, password: faker.internet.password, role: 'admin' };
            await UserModel.create(testUser);

            const response = await supertest(app)
                .post(loginEndpoint)
                .send({ username: testUser.username, password: testUser.password })
                .expect(200);

            expect(response.body).toHaveProperty('token');
        });

        it('should return a 401 Unauthorized error on invalid user login credentials', async () => {
            const response = await supertest(app)
                .post(loginEndpoint)
                .send({ username: 'invalidUser', password: 'invalidPassword' })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Invalid credentials');
        });

        it('should return a 500 Internal Server Error when user login encounters an issue', async () => {
            jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            const response = await supertest(app)
                .post(loginEndpoint)
                .send({ username: faker.internet.userName, password: faker.internet.password })
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal server error');
        });
    });

    describe('Auth Middleware', () => {
        it('should allow access for a user with the required role', async () => {
            const testUser = { username: faker.internet.userName, password: faker.internet.password, role: 'admin' };
            await UserModel.create(testUser);

            const loginResponse = await supertest(app)
                .post('/login')
                .send({ username: testUser.username, password: testUser.password });

            app.get('/admin-route', authenticate('admin'), (req, res) => {
                res.json({ message: 'Access Granted' });
            });

            const response = await supertest(app)
                .get('/admin-route')
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Access Granted');
        });


        it('should return a 403 Forbidden error for a user with insufficient permissions', async () => {
            const testUser = { username: faker.internet.userName(), password: faker.internet.password(), role: 'user' };
            await UserModel.create(testUser);

            const loginResponse = await supertest(app)
                .post('/login')
                .send({ username: testUser.username, password: testUser.password });

            app.get('/admin-route', authenticate('admin'), (req, res) => {
                res.json({ message: 'Access Granted' });
            });

            const response = await supertest(app)
                .get('/admin-route')
                .set('Authorization', `Bearer ${loginResponse.body.token}`)
                .expect(403);

            expect(response.body).toHaveProperty('error', 'Forbidden - Insufficient permissions');
        });

        it('should return a 401 Unauthorized error for a request without a JWT token', async () => {
            app.get('/admin-route', authenticate('admin'), (req, res) => {
                res.json({ message: 'Access Granted' });
            });

            const response = await supertest(app)
                .get('/admin-route')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Unauthorized - No token provided');
        });

        it('should return a 401 Unauthorized error for a request with an invalid JWT token', async () => {
            app.get('/admin-route', authenticate('admin'), (req, res) => {
                res.json({ message: 'Access Granted' });
            });

            const response = await supertest(app)
                .get('/admin-route')
                .set('Authorization', 'Bearer invalidToken')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Unauthorized - Invalid token');
        });

        it('should return a 500 Internal Server Error when authentication encounters an issue', async () => {
            jest.spyOn(require('jsonwebtoken'), 'verify').mockImplementationOnce(() => {
                throw new Error('Test Error');
            });

            app.get('/admin-route', authenticate('admin'), (req, res) => {
                res.json({ message: 'Access Granted' });
            });

            const response = await supertest(app)
                .get('/admin-route')
                .set('Authorization', 'Bearer validToken')
                .expect(500);

            expect(response.body).toHaveProperty('error', 'Internal Server Error');
        });
    });
});
