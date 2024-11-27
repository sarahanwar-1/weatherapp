/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
// Personal API Key for OpenWeatherMap API
const apiKey = '1596f8402009ff42db1da7c570527e8f'; // Replace with your actual API key

async function generateWeatherData() {
  const zip = document.getElementById('zip').value; // Get the value entered in the zip input field
  const feelings = document.getElementById('feelings').value; // Get the value entered in the feelings input field

  if (zip && feelings) { // Check if both zip and feelings are provided
    console.log(`Fetching weather data for Zipcode: ${zip} with feelings: ${feelings}`);

    try {
      // Check if zip code has a country code, if not, append ',us' (for United States)
      const zipCodeWithCountry = zip.includes(',') ? zip : `${zip},us`; // Default to 'us' if no country code is entered

      // Fetch weather data from the OpenWeatherMap API using the zip code and API key
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCodeWithCountry}&appid=${apiKey}&units=imperial`);
      
      // Convert the response to JSON format
      const weatherData = await response.json();
      
      // Log the weather data to check what we received from the API
      console.log(weatherData);

      if (weatherData.cod === 200) { // If the response is successful (code 200)
        const temp = weatherData.main.temp; // Extract temperature from the response
        const date = new Date().toLocaleDateString(); // Get current date in a readable format

        // Prepare the data to be sent to the server
        const postData = { temp, feel: feelings, date };

        // Send the weather data and feelings to the server
        const postResponse = await fetch('/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData) // Send the data in the body of the POST request
        });

        if (postResponse.ok) { // If the server responds with a successful status
          console.log('Data successfully posted');
          retrieveData(); // Call retrieveData to update the UI with the stored data
        }

      } else {
        console.log(`Error from API: ${weatherData.message}`); // Log any error message from the API
      }
    } catch (error) {
      console.log('Error:', error); // Log if there's an error with the fetch request
    }
  } else {
    console.log('Please enter both zipcode and your feelings.'); // If either is missing
  }
}

// Add the event listener to the 'generate' button
const generateButton = document.getElementById('generate');
generateButton.addEventListener('click', generateWeatherData);

// Retrieve the data from the server and update the UI
const retrieveData = async () => {
  try {
    const request = await fetch('/all'); // Fetch data from the '/all' endpoint

    // Check if the response is ok (status code 200)
    if (!request.ok) {
      throw new Error('Failed to fetch data');
    }

    // Transform the response into JSON
    const allData = await request.json();
    console.log(allData); // Log the data to the console for debugging

    // Update the DOM with the retrieved data
    document.getElementById('temp').innerHTML = Math.round(allData.temp) + '°'; // Round temperature and add ° symbol
    document.getElementById('content').innerHTML = allData.feel; // Update the feelings
    document.getElementById('date').innerHTML = allData.date; // Update the date

  } catch (error) {
    console.log('Error:', error); // Log any errors to the console
    // Optionally, handle the error (e.g., show a user-friendly message on the UI)
    document.getElementById('temp').innerHTML = 'Error retrieving temperature';
    document.getElementById('content').innerHTML = 'Error retrieving feelings';
    document.getElementById('date').innerHTML = 'Error retrieving date';
  }
}
