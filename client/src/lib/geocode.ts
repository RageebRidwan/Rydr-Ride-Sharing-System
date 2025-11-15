import axios from "axios";
import { Coordinates } from "@/types";

export async function getCoordinatesFromAddress(
  address: string
): Promise<Coordinates> {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`,
      {
        headers: {
          "User-Agent": "RideBooking-Frontend/1.0",
          "Accept-Language": "en",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
      };
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    throw new Error(
      "Failed to find location. Please check the address and try again."
    );
  }
}
