import LocationUtils from './locationUtils'

describe('Location Utils', () => {
  describe('locationToParagraph', () => {
    it('formats an address with all values', () => {
      const location = {
        buildingName: 'Stafford House',
        buildingNumber: '23',
        streetName: 'Bridge Road',
        townCity: 'Norwich',
        county: 'Norfolk',
        postCode: 'NR1 RPT',
      }

      const result = LocationUtils.locationToParagraph(location)

      expect(result).toEqual('Stafford House\n23 Bridge Road\nNorwich\nNorfolk\nNR1 RPT')
    })

    it.each(['', ' ', null, undefined])('Skips a line if any value is null or empty', (county?: string) => {
      const location = {
        buildingName: 'Stafford House',
        buildingNumber: '23',
        streetName: 'Bridge Road',
        townCity: 'Norwich',
        county,
        postCode: 'NR1 RPT',
      }

      const result = LocationUtils.locationToParagraph(location)

      expect(result).toEqual('Stafford House\n23 Bridge Road\nNorwich\nNR1 RPT')
    })

    it.each(['', ' ', null, undefined])('Skips street line if both parts are null or empty', (part?: string) => {
      const location = {
        buildingName: 'Stafford House',
        buildingNumber: part,
        streetName: part,
        townCity: 'Norwich',
        county: 'Norfolk',
        postCode: 'NR1 RPT',
      }

      const result = LocationUtils.locationToParagraph(location)

      expect(result).toEqual('Stafford House\nNorwich\nNorfolk\nNR1 RPT')
    })

    it.each(['', ' ', null, undefined])(
      'Has no extra spaces if building number or street name empty',
      (buildingNumber?: string) => {
        const location = {
          buildingName: 'Stafford House',
          buildingNumber,
          streetName: 'Bridge Road',
          townCity: 'Norwich',
          county: 'Norfolk',
          postCode: 'NR1 RPT',
        }

        const result = LocationUtils.locationToParagraph(location)

        expect(result).toEqual('Stafford House\nBridge Road\nNorwich\nNorfolk\nNR1 RPT')
      },
    )
  })
})
