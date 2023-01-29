let url = "http://api.open-notify.org/iss-now.json";

let coordinates = [];

export default async function getIssPosition() {
  const response = await fetch(url);
  const data = await response.json();
  coordinates = data.iss_position;

  return coordinates;
}
