'use strict';

const axios = require('axios');

/**
 * Geocode a place name to coordinates using Google Maps Geocoding API.
 */
async function geocodePlace(placeName) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const query = `${placeName}, India`;
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address: query, key: apiKey, region: 'IN', language: 'hi' },
      timeout: 5000,
    });

    if (response.data.status !== 'OK' || !response.data.results.length) return null;

    const result = response.data.results[0];
    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formattedAddress: result.formatted_address,
    };
  } catch (err) {
    console.error('Geocode error:', err.message);
    return null;
  }
}

/**
 * Find nearby health facilities using two parallel Places Nearby Searches:
 *   1. keyword=hospital (catches all hospitals + nursing homes + private clinics)
 *   2. keyword=primary health centre CHC (catches government PHC/CHC that may not
 *      appear under the generic hospital search)
 *
 * Returns up to 5 deduplicated results sorted by proximity (Places API order).
 * Each result: { name, address, isOpen, mapsLink }
 */
async function findNearbyHealthFacilities(lat, lng) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];

  async function search(keyword) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        {
          params: { location: `${lat},${lng}`, rankby: 'distance', keyword, key: apiKey },
          timeout: 7000,
        }
      );
      return response.data?.results || [];
    } catch (err) {
      console.error(`Places search error (${keyword}):`, err.message);
      return [];
    }
  }

  const [hospitalResults, govResults] = await Promise.all([
    search('hospital nursing home clinic'),
    search('primary health centre CHC community health'),
  ]);

  // Merge, deduplicate by place_id, keep order (proximity)
  const seen = new Set();
  const merged = [];
  for (const place of [...hospitalResults, ...govResults]) {
    if (!seen.has(place.place_id)) {
      seen.add(place.place_id);
      merged.push(place);
    }
  }

  return merged.slice(0, 3).map((place) => {
    const address = place.vicinity || '';
    const shortAddress = address.length > 60 ? address.slice(0, 57) + '...' : address;
    const searchQuery = encodeURIComponent(`${place.name}, ${address}`);
    return {
      name: place.name,
      address: shortAddress,
      isOpen: place.opening_hours?.open_now ?? null,
      mapsLink: `https://maps.google.com/maps?q=${searchQuery}`,
    };
  });
}

module.exports = { geocodePlace, findNearbyHealthFacilities };
