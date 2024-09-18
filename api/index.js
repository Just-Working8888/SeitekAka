module.exports = (req, res) => {
    const jsonServer = require('json-server');
    const server = jsonServer.create();
    const router = jsonServer.router('db.json'); // или 'api/db.json', если файл находится в папке `api`
    const middlewares = jsonServer.defaults();

    server.use(middlewares);
    server.use(router);

    server(req, res);
};
