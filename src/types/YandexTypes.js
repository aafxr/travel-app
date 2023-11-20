/**
 * @typedef URIType
 * @property {string} uri
 */

/**
 * @typedef MetaDataPropertyType
 * @property {YGeocoderMetaDataType} GeocoderMetaData
 */

/**
 * @typedef YComponentType
 * @property {string} kind
 * @property {string} name
 */

/**
 * @typedef YAddressType
 * @property {YComponentType[]} Components
 * @property {string} country_code
 * @property {string} formatted
 */

/**
 * @typedef YSubAdministrativeAreaType
 * @property {{LocalityName: string}} Locality
 * @property {YSubAdministrativeAreaType} [SubAdministrativeArea]
 */
/**
 * @typedef YAdministrativeAreaType
 * @property {string} AdministrativeAreaName
 * @property {YSubAdministrativeAreaType} SubAdministrativeArea
 */

/**
 * @typedef YCountryType
 * @property {string} AddressLine
 * @property {YAdministrativeAreaType} AdministrativeArea
 * @property {string} CountryName
 * @property {string} CountryNameCode
 */

/**
 * @typedef YGeocoderMetaDataType
 * @property {YAddressType} Address
 * @property {{Country: YCountryType}} AddressDetails
 * @property {string} kind
 * @property {string} precision
 * @property {string} text
 */

/**
 * @typedef GeoObjectPropertiesType
 * @property {string} balloonContent
 * @property {string} balloonContentBody
 * @property {[[number, number],[number, number]]} boundedBy
 * @property {string} description
 * @property {MetaDataPropertyType} metaDataProperty
 * @property {string} name
 * @property {string} text
 * @property {{URI: URIType, URIs: URIType[]}} uriMetaData
 */