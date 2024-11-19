import Geocoder from "node-geocoder";

const options = {
  provider: process.env.PROVIDER,
  apiKey: process.env.GEOJSON_PROVIDER_API_KEY,
  httpAdapter: "https",
  formatter: null,
};

const geocoder = Geocoder(options);

export default geocoder;
