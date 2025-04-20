// src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Team API calls
export const createTeam = async (teamData) => {
  try {
    const response = await api.post('/api/teams', teamData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTeams = async () => {
  try {
    const response = await api.get('/api/teams');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Player API calls
export const createPlayer = async (playerData) => {
  try {
    const response = await api.post('/api/players', playerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPlayers = async (teamId) => {
  try {
    const response = await api.get(`/api/players?teamId=${teamId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Match API calls
export const createMatch = async (matchData) => {
  try {
    const response = await api.post('/api/matches', matchData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatches = async () => {
  try {
    const response = await api.get('/api/matches');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMatch = async (matchId) => {
  try {
    const response = await api.get(`/api/matches/${matchId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delivery API calls
export const recordDelivery = async (deliveryData) => {
  try {
    const response = await api.post('/api/deliveries', deliveryData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;