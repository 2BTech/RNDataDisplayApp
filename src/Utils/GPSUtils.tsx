import { GPSCoordinate } from "../redux/slices/gpsSlice"

export const convertGPSToString: (coord: GPSCoordinate) => string = (coord: GPSCoordinate) => {
    return coord.longitude + ',' + coord.latitude + ',' + coord.altitude;
};

export default { convertGPSToString }