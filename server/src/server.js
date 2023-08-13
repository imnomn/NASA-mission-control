require('dotenv').config()
const http = require('http');
const mongoose = require('mongoose')
const app = require('./app');
const {mongoConnect} = require('./services/mongo')
const { loadPlanets } = require('./model/planets.model');
const { loadLaunchData } = require('./model/launches.model');


PORT = process.env.PORT || 8000;


const server = http.createServer(app);
async function startServer(){
    await mongoConnect();
    await loadPlanets();
    await loadLaunchData();
    server.listen(PORT, ()=>console.log(`listening on port ${PORT}`))
}

startServer();

