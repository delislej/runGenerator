
import axios from 'axios'
import haversine from 'haversine'

// return a JSON object that contains a route encoded polyline and metrics

export async function getRoute (long, lat, length, round, seed) {
  var postData = { coordinates: [[long, lat]], options: { round_trip: { length: length, points: round, seed: seed } }, elevation: false, units: 'mi', geometry: true }
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    }
  }

  const response = await axios.post('http://71.202.1.245:8080/ors/v2/directions/foot-walking', postData, axiosConfig)
    .then((res) => {
      //if we successfully get a route, decode its polyline and return it
      //console.log(res.data.routes[0].segments[0].distance)
      return res.data.routes[0];
    })
    .catch((err) => {
      console.log('AXIOS ERROR: ', err)
    })
  return response
}

// decode an encoded polyline to an array of coordinates and elevations

export function decodePoly (encodedPolyline, includeElevation) {
  const points = []
  let index = 0
  const len = encodedPolyline.length
  let lat = 0
  let lng = 0
  let ele = 0
  while (index < len) {
    let b
    let shift = 0
    let result = 0
    do {
      b = encodedPolyline.charAt(index++).charCodeAt(0) - 63 // finds ascii
      // and subtract it by 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    lat += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
    shift = 0
    result = 0
    do {
      b = encodedPolyline.charAt(index++).charCodeAt(0) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))

    if (includeElevation) {
      shift = 0
      result = 0
      do {
        b = encodedPolyline.charAt(index++).charCodeAt(0) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      ele += ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1))
    }
    try {
      const location = { latitude: (lat / 1E5), longitude: (lng / 1E5), ele: 0 }
      if (includeElevation) location.ele = (ele / 100)
      points.push(location)
    } catch (e) {
      console.log(e)
    }
  }
  return points
}
// uses the haversine equation to calculate the distance between two coordinates

export function calcDistance (newLatLng, oldLatLng) {
  return haversine(oldLatLng, newLatLng, { unit: 'mile' }) || 0
};

//get region from array of longlats
export function getRegionForCoordinates(points) {
  // points should be an array of { latitude: X, longitude: Y }
  let minX, maxX, minY, maxY;

  // init first point
  ((point) => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);

  // calculate rect
  points.map((point) => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = (maxX - minX);
  const deltaY = (maxY - minY);

  return {
    latitude: midX,
    longitude: midY,
    latitudeDelta: deltaX,
    longitudeDelta: deltaY
  };
}
