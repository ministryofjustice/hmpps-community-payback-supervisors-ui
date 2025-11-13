import { LocationDto } from '../@types/shared'

export default class LocationUtils {
  static locationToParagraph(location: LocationDto) {
    const streetParts = [location.buildingNumber, location.streetName]
    const street = streetParts.join(' ')

    const addressParts = [location.buildingName, street, location.townCity, location.county, location.postCode]

    return addressParts
      .map(line => line?.trim())
      .filter(line => line !== undefined && line !== null && line !== '')
      .join('\n')
  }
}
