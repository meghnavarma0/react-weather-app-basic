import React, { Component } from 'react';
import './App.css';
import 'weather-icons/css/weather-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from './app-component/form.component';
import Weather from './app-component/weather.component';

const API_KEY = '65cca570a11a3e55d2a3c0b2250a0791';
class App extends Component {
	constructor() {
		super();
		this.state = {
			city: undefined,
			country: undefined,
			icon: undefined,
			main: undefined,
			celsius: undefined,
			temp_max: undefined,
			temp_min: undefined,
			description: '',
			error: false,
			showWeather: false
		};

		this.weatherIcon = {
			Thunderstrom: 'wi-thunderstrom',
			Drizzle: 'wi-sleet',
			Rain: 'wi-storm-showers',
			Snow: 'wi-snow',
			Atmosphere: 'wi-fog',
			Clear: 'wi-day-sunny',
			Clouds: 'wi-day-fog'
		};
	}

	calCelsius = temp => {
		let cel = Math.floor(temp - 273.15);
		return cel;
	};
	getWeatherIcon(icon, rangeId) {
		switch (true) {
			case rangeId >= 200 && rangeId <= 232:
				this.setState({ icon: this.weatherIcon.Thunderstrom });
				break;
			case rangeId >= 300 && rangeId <= 321:
				this.setState({ icon: this.weatherIcon.Drizzle });
				break;

			case rangeId >= 500 && rangeId <= 531:
				this.setState({ icon: this.weatherIcon.Rain });
				break;
			case rangeId >= 600 && rangeId <= 622:
				this.setState({ icon: this.weatherIcon.Snow });
				break;
			case rangeId >= 701 && rangeId <= 781:
				this.setState({ icon: this.weatherIcon.Atmosphere });
				break;
			case rangeId === 800:
				this.setState({ icon: this.weatherIcon.Clear });
				break;
			case rangeId >= 801 && rangeId <= 804:
				this.setState({ icon: this.weatherIcon.Clouds });
				break;
			default:
				this.setState({ icon: this.weatherIcon.Clouds });
		}
	}

	getWeather = async e => {
		e.preventDefault();

		let city = e.target.elements.city.value;
		let country = e.target.elements.country.value;
		if (city && country) {
			const api_call = await fetch(
				`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`
			);

			const response = await api_call.json();

			console.log(response);
			this.setState({
				city: response.name,
				country: response.sys.country,
				celsius: this.calCelsius(response.main.temp),
				temp_max: this.calCelsius(response.main.temp_max),
				temp_min: this.calCelsius(response.main.temp_min),
				description: response.weather[0].description,
				showWeather: true
			});
			this.getWeatherIcon(this.Thunderstrom, response.weather[0].id);
		} else {
			this.setState({ error: true });
		}
	};
	render() {
		return (
			<div className='App'>
				<Form loadWeather={this.getWeather} error={this.state.error} />
				{this.state.showWeather ? (
					<Weather
						city={this.state.city}
						country={this.state.country}
						temp_celsius={this.state.celsius}
						temp_min={this.state.temp_min}
						temp_max={this.state.temp_max}
						description={this.state.description}
						weatherIcon={this.state.icon}
					/>
				) : null}
			</div>
		);
	}
}

export default App;
