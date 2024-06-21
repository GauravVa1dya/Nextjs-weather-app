"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./styles/page.module.css";
import Navbar from "./components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThermometerHalf,
  faWind,
  faTint,
  faSun,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: "long" };
  const monthName = currentDate.toLocaleString("en-US", options);
  const date = currentDate.getDate() + ", " + monthName;
  return date;
}

const Home = () => {
  const currentDate = getCurrentDate();
  const [weatherData, setWeatherData] = useState(null);
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

  async function fetchData(cityName) {
    if (cityName.trim() === "") return;
    try {
      const response = await fetch(
        "/api/forecast?address=" + cityName
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
        `/api/forecast?lat=${latitude}&lon=${longitude}`
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
      console.log("data", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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

    return dailyForecasts.slice(0, 7);
  }

  function getTodaysForecast(list) {
    const today = new Date().toISOString().split("T")[0];
    return list.filter((item) => item.dt_txt.split(" ")[0] === today);
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
          {weatherData && weatherData.list && weatherData.list.length > 0 ? (
            <>
              <div className="row">
                <div className="col-md-8">
                  <article className="widget">
                    <div
                      className={`d-flex justify-content-between ${styles.weatherTemp}`}
                    >
                      <div>
                        <h1>{weatherData.city.name}</h1>
                        <p>
                          Chance of Rain:{" "}
                          {(weatherData.list[0].pop * 100).toFixed(0)}%
                        </p>
                        <h2>
                          {(weatherData.list[0].main.temp - 273.15).toFixed(0)}°
                        </h2>
                      </div>
                      <div>
                        <Image
                          className={`${styles.weathermainicon}`}
                          src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                          alt="weather icon"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>

                    <div className={` ${styles.todayforecast} mb-3`}>
                      <h3>TODAY'S FORECAST</h3>
                      <div
                        className={`justify-content-between ${styles.forecastweather}`}
                      >
                        {getTodaysForecast(weatherData.list).map((forecast) => {
                          const date = new Date(forecast.dt_txt);
                          let hours = date.getHours();
                          const minutes = date.getMinutes();
                          const ampm = hours >= 12 ? "PM" : "AM";
                          hours = hours % 12;
                          hours = hours ? hours : 12;
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
                                <Image
                                  src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                  alt={forecast.weather[0].description}
                                  width={100}
                                  height={100}
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
                    <div className={` ${styles.todayforecast} mb-3`}>
                      <div className="d-flex justify-content-between">
                        <h3>AIR CONDITIONS</h3>
                        <button
                          className="btn btn-primary"
                          style={{
                            padding: "3px",
                            paddingLeft: "8px",
                            paddingRight: "8px",
                            fontSize: "13px",
                            borderRadius: "25px",
                          }}
                        >
                          See more
                        </button>
                      </div>
                      <div className="row">
                        <div className="col-6 col-md-6 text-left mb-3 mt-2">
                          <div
                            className="d-flex  align-items-left justify-content-left"
                            style={{ paddingLeft: "10px" }}
                          >
                            <FontAwesomeIcon
                              icon={faThermometerHalf}
                              className="me-2"
                              style={{ color: "#909197", fontSize: "24px" }}
                            />
                            <div>
                              <div className="text-muted">Real Feel</div>
                              <div className={`fw-bold ${styles.percent}`}>
                                {(
                                  weatherData.list[0].main.feels_like - 273.15
                                ).toFixed(0)}
                                °
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 col-md-6 text-left mb-3 mt-2">
                          <div className="d-flex  align-items-left justify-content-left">
                            <FontAwesomeIcon
                              icon={faWind}
                              className="me-2"
                              style={{ color: "#909197", fontSize: "24px" }}
                            />
                            <div>
                              <div className="text-muted">Wind</div>
                              <div className={`fw-bold ${styles.percent}`}>
                                {weatherData.list[0].wind.speed} km/h
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 col-md-6 text-left mb-3">
                          <div
                            className="d-flex  align-items-left justify-content-left"
                            style={{ paddingLeft: "10px" }}
                          >
                            <FontAwesomeIcon
                              icon={faTint}
                              className="me-2"
                              style={{ color: "#909197", fontSize: "24px" }}
                            />
                            <div>
                              <div className="text-muted">Chance of rain</div>
                              <div className={`fw-bold ${styles.percent}`}>
                                {(weatherData.list[0].pop * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 col-md-6 text-left mb-3">
                          <div className="d-flex align-items-left justify-content-left">
                            <FontAwesomeIcon
                              icon={faSun}
                              className="me-2"
                              style={{ color: "#909197", fontSize: "24px" }}
                            />
                            <div>
                              <div className="text-muted">UV Index</div>
                              <div className={`fw-bold ${styles.percent}`}>
                                3
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>

                <div className={`col-md-4 ${styles.sevenDayforecast}`}>
                  <h3>7-Day Forecast</h3>
                  <div className="justify-content-between">
                    {getDailyForecasts(weatherData.list).map((forecast) => (
                      <div
                        key={forecast.dt}
                        className={` d-flex text-center`}
                        style={{
                          borderBottom: "1px solid rgba(225, 224, 224, 0.9)",
                        }}
                      >
                        <div className={`${styles.dateforcast}`}>
                          {getDayName(forecast.dt_txt.split(" ")[0])}
                        </div>
                        <div className={`${styles.forcastdaysimage}`}>
                          <Image
                            src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                            alt={forecast.weather[0].description}
                            width={100}
                            height={100}
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
              </div>
            </>
          ) : (
            <div>
              <h1>
                <span className={`${styles.let1}`}>l</span>
                <span className={`${styles.let2}`}>o</span>
                <span className={`${styles.let3}`}>a</span>
                <span className={`${styles.let4}`}>d</span>
                <span className={`${styles.let5}`}>i</span>
                <span className={`${styles.let6}`}>n</span>
                <span className={`${styles.let7}`}>g</span>
              </h1>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
