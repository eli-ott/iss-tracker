let url = "https://api.wheretheiss.at/v1/satellites/25544";

let coordinates;

export default async function getIssPosition() {
  const response = await fetch(url);
  const data = await response.json();
  coordinates = {latitude: data.latitude, longitude: data.longitude};

  return coordinates;
}
