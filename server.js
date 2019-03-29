const express = require('express');
const helmet = require('helmet');
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

const server = express();

// middleware
server.use(express.json());
server.use(helmet());

// Routing
server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

// Route Handlers
server.get('/', (req, res) => {
    res.send(`
    <h2>Welcome to the Jungle</h2>
    `)
});

module.exports = server;