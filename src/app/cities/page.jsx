"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/page.module.css";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThermometerHalf,
  faWind,
  faTint,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

function getCurrentTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${adjustedHours}:${formattedMinutes} ${ampm}`;
}

const Cities = () => {
  const currentTime = getCurrentTime();
  const [weatherData, setWeatherData] = useState(null);
  const [cityData, setcityData] = useState(null);
  const [cityData1, setcityData1] = useState(null);
  const [cityData2, setcityData2] = useState(null);
  const [city, setCity] = useState("");

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    return days[date.getDay()];
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  async function fetchData(cityName) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/forecast?address=" + cityName
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
      console.log("data", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchDataByCoordinates(latitude, longitude) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forecast?lat=${latitude}&lon=${longitude}`
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
      console.log("data", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchData1(city) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forecast?address=${city}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const jsonData = (await response.json()).data;
      setcityData(jsonData);
      console.log("Weather data:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData1("Bengaluru");
  }, []);

  async function fetchData2(city) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forecast?address=${city}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const jsonData = (await response.json()).data;
      setcityData1(jsonData);
      console.log("Weather data:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData2("Delhi");
  }, []);

  async function fetchData3(city) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/forecast?address=${city}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const jsonData = (await response.json()).data;
      setcityData2(jsonData);
      console.log("Weather data:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchData3("Kolkata");
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchData(city);
  }, [city]);

  function getDailyForecasts(list) {
    const dailyForecasts = [];
    const seenDates = new Set();

    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      const time = item.dt_txt.split(" ")[1];

      if (!seenDates.has(date) && time === "12:00:00") {
        dailyForecasts.push(item);
        seenDates.add(date);
      }
    });

    return dailyForecasts.slice(0, 3); // Ensure we only get 3 days
  }

  function getTodaysForecast(list) {
    const today = new Date().toISOString().split("T")[0];
    return list
      .filter((item) => item.dt_txt.split(" ")[0] === today)
      .slice(0, 3);
  }

  return (
    <main className={`container-fluid ${styles.main}`}>
      <div className={` row p-3 `}>
        <div className={`col-md-1 ${styles.navbar}`}>
          <Navbar />
        </div>
        <div className={`col-md-10 ${styles.colmd10}`}>
          <div className={`input-group mb-3 ${styles.inputSearch}`}>
            <input
              type="text"
              className={`form-control ${styles.searchbar} `}
              placeholder="Search for cities"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          {weatherData &&
          weatherData.list &&
          weatherData.list.length &&
          cityData &&
          cityData.list &&
          cityData.list.length &&
          cityData1 &&
          cityData1.list &&
          cityData1.list.length &&
          cityData2 &&
          cityData2.list &&
          cityData2.list.length > 0 ? (
            <>
              <div className="row">
                <div className="col-md-8">
                  <article className="widget">
                    <div className={` ${styles.todaycityforecast1} mb-3`}>
                      <div className="d-flex">
                        <img
                          src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                          alt="weather icon"
                        />
                        <h1 className={`${styles.citiesdata}`}>
                          {weatherData.city.name}
                          <br></br>
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#909197",
                              paddingLeft: "10px",
                            }}
                          >
                            {currentTime}
                          </span>
                        </h1>
                        <h2 className={`${styles.citytemp}`}>
                          {(weatherData.list[0].main.temp - 273.15).toFixed(0)}°
                        </h2>
                      </div>
                    </div>
                  </article>
                  <article className="widget">
                    <div className={` ${styles.todaycityforecast1} mb-3`}>
                      <div className="d-flex">
                        <img
                          src={`https://openweathermap.org/img/wn/${cityData.list[0].weather[0].icon}@2x.png`}
                          alt="weather icon"
                        />
                        <h1 className={`${styles.citiesdata}`}>
                          {cityData.city.name}
                          <br></br>
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#909197",
                              paddingLeft: "10px",
                            }}
                          >
                            {currentTime}
                          </span>
                        </h1>
                        <h2 className={`${styles.citytemp}`}>
                          {(cityData.list[0].main.temp - 273.15).toFixed(0)}°
                        </h2>
                      </div>
                    </div>
                  </article>
                  <article className="widget">
                    <div className={` ${styles.todaycityforecast1} mb-3`}>
                      <div className="d-flex">
                        <img
                          src={`https://openweathermap.org/img/wn/${cityData1.list[0].weather[0].icon}@2x.png`}
                          alt="weather icon"
                        />
                        <h1 className={`${styles.citiesdata}`}>
                          {cityData1.city.name}
                          <br></br>
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#909197",
                              paddingLeft: "10px",
                            }}
                          >
                            {currentTime}
                          </span>
                        </h1>
                        <h2 className={`${styles.citytemp}`}>
                          {(cityData1.list[0].main.temp - 273.15).toFixed(0)}°
                        </h2>
                      </div>
                    </div>
                  </article>
                  <article className="widget">
                    <div className={` ${styles.todaycityforecast1} mb-3`}>
                      <div className="d-flex">
                        <img
                          src={`https://openweathermap.org/img/wn/${cityData2.list[0].weather[0].icon}@2x.png`}
                          alt="weather icon"
                        />
                        <h1 className={`${styles.citiesdata}`}>
                          {cityData2.city.name}
                          <br></br>
                          <span
                            style={{
                              fontSize: "14px",
                              color: "#909197",
                              paddingLeft: "10px",
                            }}
                          >
                            {currentTime}
                          </span>
                        </h1>
                        <h2 className={`${styles.citytemp}`}>
                          {(cityData2.list[0].main.temp - 273.15).toFixed(0)}°
                        </h2>
                      </div>
                    </div>
                  </article>
                </div>

                <div className="col-md-4">
                  <article className="widget">
                    <div
                      className={`d-flex justify-content-between ${styles.weatherTemp}`}
                    >
                      <div>
                        <h1>{weatherData.city.name}</h1>
                        <p>Chance of rain: 0%</p>
                        <h2>
                          {(weatherData.list[0].main.temp - 273.15).toFixed(0)}°
                        </h2>
                      </div>
                      <div>
                        <img
                          className={`${styles.weathermainicon}`}
                          src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                          alt="weather icon"
                        />
                      </div>
                    </div>

                    <div className={` ${styles.todayforecast1} mb-3`}>
                      <h3>TODAY'S FORECAST</h3>
                      <div
                        className={`justify-content-between ${styles.forecastweather1}`}
                      >
                        {getTodaysForecast(weatherData.list).map((forecast) => {
                          const date = new Date(forecast.dt_txt);
                          let hours = date.getHours();
                          const minutes = date.getMinutes();
                          const ampm = hours >= 12 ? "PM" : "AM";
                          hours = hours % 12;
                          hours = hours ? hours : 12; // the hour '0' should be '12'
                          const strTime = `${hours}:${
                            minutes < 10 ? "0" + minutes : minutes
                          } ${ampm}`;

                          return (
                            <div
                              key={forecast.dt}
                              className={`text-center ${styles.daysforecast}`}
                            >
                              <div className={`${styles.forecasttime}`}>
                                {strTime}
                              </div>
                              <div className={`${styles.forecastimage}`}>
                                <img
                                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                  alt={forecast.weather[0].description}
                                />
                              </div>
                              <div className={`${styles.forecasttemp}`}>
                                {(forecast.main.temp - 273.15).toFixed(0)}°
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className={`${styles.threeDayforecast}`}
                      style={{ backgroundColor: "#F5F5F5" }}
                    >
                      <h3>3-Day Forecast</h3>
                      <div className="justify-content-between">
                        {getDailyForecasts(weatherData.list).map((forecast) => (
                          <div
                            key={forecast.dt}
                            className={` d-flex text-center`}
                            style={{
                              borderBottom:
                                "1px solid rgba(225, 224, 224, 0.9)",
                            }}
                          >
                            <div className={`${styles.dateforcast}`}>
                              {getDayName(forecast.dt_txt.split(" ")[0])}
                            </div>
                            <div className={`${styles.forcastdaysimage}`}>
                              <img
                                src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                alt={forecast.weather[0].description}
                              />
                              {forecast.weather[0].description}
                            </div>
                            <div className={`${styles.forecasttemplast}`}>
                              {(forecast.main.temp - 273.15).toFixed(0)}°
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Cities;
