const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let DEFAULT_FLIGHT_NUMBER = 100;
let SPACE_X_URL = 'https://api.spacexdata.com/v4/launches/query';




async function saveLaunch(launch){
       
        await launches.findOneAndUpdate({flightNumber: launch.flightNumber}, launch,{
            upsert: true
        })
    }

async function populateLaunches(){
    const response = await axios.post(SPACE_X_URL, {
        query: {
           
        },
        options: {
          pagination: false,
          populate: [
            {
              path: 'rocket',
              select: {
                name: 1
              }
            },
            {
              path: 'payloads',
              select: {
                customers: 1
              }
            }
          ]
        }
      });
      if(response.status !== 200){
        console.log("problem getting lauch data")
throw new Error("Launch data download failed")
    }

      const launchDocs = response?.data?.docs;
      for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap(payload=>payload['customers'])
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
            

        }
        await saveLaunch(launch)
        console.log(`${launch.flightNumber}, ${launch.rocket} dataa`)
      }
}

async function loadLaunchData(){
  const firstLaunch =   await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if(firstLaunch){
     return console.log("launches data already exists")
    }
    else{
     await populateLaunches()
    }



}


async function findLaunch(filter){
   return await launches.findOne(filter)
}


async function existsLaunchWithId(launchId){
   return await findLaunch({flightNumber: launchId})
}


async function getAllLaunches(limit, skip){
   return await launches
   .find({},{_id: 0, __v:0})
   .sort({flightNumber: 1})
   .skip(skip)
   .limit(limit)
   
}


async function getLatestFlightNumber(){
    const latestLaunch = await  launches.findOne({}).limit(1).sort({flightNumber: -1});
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}


async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({keplerName: launch.target});
    if(!planet){
        throw new Error("No matching planet was found")
    }
 const newFlightNumber = await getLatestFlightNumber() + 1;
    saveLaunch(Object.assign(launch, 
        {   flightNumber: newFlightNumber, 
            customers: ['NASA', 'ZTM'],
            upcoming: true,
            success: true,
         }));

}

async function abortLaunchById(id){
    const aborted =  await launches.updateOne({   
        flightNumber: id},{
        upcoming: false,
        success: false
    })
    return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    
}