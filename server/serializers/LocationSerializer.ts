import type { Location } from '@prisma/client';

export class LocationSerializer {
  static formatLocation(location: Location) {
    return {
      id: location.id,
      name: location.name,
    };
  }

  static list(locations: Location[]) {
    return locations.map(location => this.formatLocation(location));
  }

  static detail(location: Location | null) {
    return location ? this.formatLocation(location) : null;
  }
}
