//import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
//const SCREEN_WIDTH = Dimensions.get('window').width;
const API_KEY = "2083013c62df42f64af0446901fe3feb";

const  icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("lodding...");
  const [days, setDays] = useState([]);
  // const [location, setLocation] = useState(null);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    // console.log(permission);
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
        if (weather.dt_txt.includes("00:00:00")) {
          return weather;
        }
      })
    );

  };
  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large" />
          </View>
        ) : (
          days.map((day, index) =>
            <View key={index} style={styles.day}>
              <View style={{ 
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>

              <Text style={styles.description}>
                {day.weather[0].main}
              </Text>
              <Text style={styles.tinyText}>
                {day.weather[0].description}
              </Text>
            </View>
          ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 45,
    fontWeight: "400",
    color: "white",
    marginTop: 80,
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 85,
    color: "white",
    fontWeight: "400",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
  },
  tinyText:{
    fontSize:15,
    color: "white",
    fontWeight: "400",
  }
});