export const CONDITIONS = [
  "Heart Disease",
  "ALS",
  "FOP",
  "Gaucher",
  "Kawasaki",
];

const RUNNING_LOCALLY = false;

export const BACKEND_URL = RUNNING_LOCALLY 
  ? "http://localhost:8000/" 
  : "https://syntara-docker.onrender.com";