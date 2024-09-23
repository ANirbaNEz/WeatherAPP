
const openWeatherApiKey = '170740c0f0426c0c4ab486f72d6465d8';

const pixabayApiKey = '46134474-ce6b0b6875855587623709918';

const getWeatherBtn = document.getElementById('getWeatherBtn');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
});

function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherData(data);
        })
        .catch(error => {
            alert(error.message);
        });
}

function displayWeatherData(data) {
    cityName.textContent = `Weather in ${data.name}, ${data.sys.country}`;
    temperature.textContent = `Temperature: ${data.main.temp} °C`;
    weatherDescription.textContent = `Conditions: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Change background based on weather condition
    changeBackground(data.weather[0].main.toLowerCase());
}

function changeBackground(weatherCondition) {
    let query = '';

    // Set query based on weather condition
    switch (weatherCondition) {
        case 'clear':
            query = 'clear sky';
            break;
        case 'clouds':
            query = 'cloudy sky';
            break;
        case 'rain':
            query = 'rain';
            break;
        case 'snow':
            query = 'snowy';
            break;
        case 'thunderstorm':
            query = 'thunderstorm';
            break;
        case 'mist':
        case 'fog':
            query = 'fog';
            break;
        case 'sunny':
            query = 'sunny';
            break;
        default:
            query = 'weather'; // Fallback query
            break;
    }

    // Fetch an image from Pixabay based on the weather condition
    fetch(`https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(query)}&image_type=photo&category=nature&orientation=horizontal`)
        .then(response => response.json())
        .then(data => {
            if (data.hits.length > 0) {
                // Get the URL of the first image result
                const imageUrl = data.hits[0].largeImageURL;
                document.body.style.backgroundImage = `url('${imageUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.transition = 'background 0.5s ease'; // Smooth transition effect
            } else {
                // Set a default background if no images are found
                document.body.style.backgroundColor = '#e0f7fa';
            }
        })
        .catch(error => {
            console.error('Error fetching image:', error);
            // Set a default background in case of an error
            document.body.style.backgroundColor = '#e0f7fa';
        });
}
