const request = require('supertest');
const app = require("../../app");
const {
    loadPlanetsData,
  } = require('../../model/planets.model');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')

describe("launches Api", ()=>{

    beforeAll(async()=>{
        await mongoConnect()
        await loadPlanetsData();
    })
  
    describe("Test GET/Launch", ()=>{
        test("It should repsond with 200 status", async()=>{
            const response = await request(app).get("/v1/launches").expect("Content-Type", /json/).expect(200)
           
        })
    })
    
    describe("Test POST/Launch", ()=>{
        const launchData = {
            mission: "USS Enterprise",
            rocket: "NCC 120",
            target: "Kepler-62 f",
            launchDate: "january 28, 2024",
        };
        launchDataWithoutDate ={
            mission: "USS Enterprise",
            rocket: "NCC 120",
            target: "Kepler-62 f",
        };
    
        test("It should repsond with 201 status", async()=>{
            const response =await request(app)
            .post('/v1/launches')
            .send(launchData)
            .expect("Content-Type", /json/)
            .expect(201);
            const requestDate = new Date(launchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate)
        });
        test("It should catch Missing Required Launch Property", async()=>{
    
            const response =await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect("Content-Type", /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({error: "Missing Required Launch Property"})
        });
        test("It should catch Invalid date", async()=>{
    
            const response =await request(app)
            .post('/v1/launches')
            .send({...launchData, launchDate: "lakjdsf"})
            .expect("Content-Type", /json/)
            .expect(400);
            expect(response.body).toStrictEqual({error: "Invalid date"})
        });
    })
    afterAll(async()=>{
    
         await mongoDisconnect()
    
    })
})
