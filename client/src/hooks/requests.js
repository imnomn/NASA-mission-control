const API_URL = 'http://localhost:8000/v1';

async function httpGetPlanets() {

  return fetch(`${API_URL}/planets`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return  response.json();
  })
  .catch(error => {
    // Handle any errors
    console.error("Error fetching JSON:", error);
  });
  //  const response =  await fetch(`${API_URL}/planets`)
//   console.log(response, 'response');
//   return await response.json();
} 

async function httpGetLaunches() {
  // return fetch(`${API_URL}/launches`)
  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! Status: ${response.status}`);
  //   }
  //   console.log( response.json(), 'response')
  //   return response.json();
  // })
  // .catch(error => {
  //   // Handle any errors
  //   console.error("Error fetching JSON:", error);
  // });
   const response =  await fetch(`${API_URL}/launches`)
  console.log(response, 'response');
  const fetchedlaunches = await response.json();
  return fetchedlaunches.sort((a,b)=> {
    return a.flightNumber - b.flightNumber
  } )

}

async function httpSubmitLaunch(launch) {
  try {

    return await fetch(`${API_URL}/launches`, {
       method: 'post', 
       headers:{
         "Content-type": "application/json"
     },
       body: JSON.stringify(launch),
    })
   }
   catch(err){
    return {
      ok: false
    }
   }
  
  
  }
  

async function httpAbortLaunch(id) {
  try {

    return await fetch(`${API_URL}/launches/${id}`, {
       method: 'delete', 
       headers:{
         "Content-type": "application/json"
       }
    })
   }
   catch(err){
    return {
      ok: false
    }
   }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};