

function isWithinOneMileRadius(array) {
  let searchCoordinates;


  if (!array) {
    alert('Please enter valid latitude longitude coordinates');
    return false;
  }

  if (JSON.parse(sessionStorage.getItem('searchCoordinates'))) {
    searchCoordinates = JSON.parse(sessionStorage.getItem('searchCoordinates'))
  } else {
    searchCoordinates = JSON.parse(sessionStorage.getItem('startCoordinates'))
  }

  const [baseLat, baseLong] = searchCoordinates;
  const [lat, long] = array;

  const toRadians = degrees => degrees * Math.PI / 180;
  const earthRadius = 3958.8; // Radius of Earth in miles

  const deltaLat = toRadians(lat - baseLat);
  const deltaLong = toRadians(long - baseLong);

  const a = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(baseLat)) * Math.cos(toRadians(lat)) *
    Math.sin(deltaLong / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  sessionStorage.setItem('searchCoordinates', JSON.stringify(array));
  return distance <= 1 ? 'within' : 'outside';
}

export default isWithinOneMileRadius;
