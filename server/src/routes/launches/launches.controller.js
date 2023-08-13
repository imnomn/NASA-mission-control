const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId , abortLaunchById} = require('../../model/launches.model');
const {getPagination} = require('../../services/query');
const  httpGetAllLaunches = async(req, res)=> {

   const {skip, limit} = getPagination(req.query);

   return res.status(200).json(await getAllLaunches(limit, skip));

};
const httpAddNewLaunch = async (req, res)=>{
   const launch = req.body;
   if( !launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
      return res.status(400).json({
         error: "Missing Required Launch Property",
      })
   } 
   launch.launchDate = new Date(launch.launchDate)
   if(isNaN(launch.launchDate)){
      return res.status(400).json({
         error: "Invalid date"
      })
   }
   await scheduleNewLaunch(launch)
 
   return res.status(201).json(launch)
}
const httpAbortLaunch = async (req, res) =>{
   const id = Number(req.params.id);
const existLaunch = await existsLaunchWithId(id)
   if(!existLaunch){
   return res.status(400).json({
      error: "launch Does not Exists"
      })
   }
   const aborted = await abortLaunchById(id);
   if(!aborted){
      return res.status(400).json({error: 'Launch not aborted'})
   }
return res.status(200).json({ok: true})
}

module.exports ={ 
   httpGetAllLaunches,
   httpAddNewLaunch,
   httpAbortLaunch,
   

};