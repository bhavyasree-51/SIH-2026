import { demoWeather } from '../data/farmData'
export type WeatherData = typeof demoWeather
export interface WeatherService { getWeather(latitude: number, longitude: number): Promise<WeatherData> }
export const demoWeatherService: WeatherService = { async getWeather(latitude, longitude) { await new Promise((resolve) => setTimeout(resolve, 350)); const offset = Math.round((Math.abs(latitude) + Math.abs(longitude)) % 3); return { ...demoWeather, temperature: demoWeather.temperature + offset, rainProbability: Math.max(10, demoWeather.rainProbability - offset * 2) } } }