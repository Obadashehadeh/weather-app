// src/services/LocationService.ts
import apiClient from "./api";
import { Location } from "@/store/modules/weather";

class LocationService {
  async getSavedLocations(): Promise<Location[]> {
    try {
      const response = await apiClient.get<Location[]>(`/locations`);
      return response.data;
    } catch (error) {
      console.error("Error fetching saved locations:", error);
      throw error;
    }
  }

  async saveLocation(location: Partial<Location>): Promise<Location> {
    try {
      const response = await apiClient.post<Location>(`/locations`, location);
      return response.data;
    } catch (error) {
      console.error("Error saving location:", error);
      throw error;
    }
  }

  async deleteLocation(id: string): Promise<void> {
    try {
      await apiClient.delete(`/locations/${id}`);
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  }
}

export default new LocationService();
