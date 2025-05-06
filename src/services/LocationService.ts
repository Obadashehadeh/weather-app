import { LocationsAPI } from "@/api/API";
import { Location } from "@/store/modules/weather";

class LocationService {
  async getSavedLocations(): Promise<Location[]> {
    const response = await LocationsAPI.getSavedLocations();
    return response.data;
  }

  async saveLocation(location: Partial<Location>): Promise<Location> {
    const response = await LocationsAPI.saveLocation(location);
    return response.data;
  }

  async deleteLocation(id: string): Promise<void> {
    await LocationsAPI.deleteLocation(id);
  }
}

export default new LocationService();
