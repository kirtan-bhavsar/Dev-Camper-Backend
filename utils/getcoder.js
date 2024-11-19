import Geocoder from "node-geocoder";

const options = {
  provider: "opencage",
  apiKey: "00a9ecc3ca4545b98c1c31ffc650e215",
  httpAdapter: "https",
  formatter: null,
};

const geocoder = Geocoder(options);

export default geocoder;
