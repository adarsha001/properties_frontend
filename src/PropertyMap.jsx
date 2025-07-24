// components/PropertyMap.jsx
import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  StandaloneSearchBox
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '90vh'
};

const propertyLocation = {
   lat: 13.0554006,
  lng: 77.7183994
};

const places = [
  { name: 'Manipal Hospital',  lat: 13.0541408,
  lng: 77.7176502, icon: '🏥' },
  { name: 'Delhi Public School', lat: 13.0503197,
  lng: 77.7146563, icon: '🎓' },
  { name: 'udupiRestaurant',   lat: 13.0528715,
  lng: 77.7190537, icon: '🍽️' },
  { name: 'gym',  lat: 13.0550796, lng: 77.7177279, icon: '💪' }
];

const PropertyMap = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB5phvaZM_0OCNCM_cRiCFUHPYiKg0jEG8',
    libraries: ['places']
  });

  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [distanceData, setDistanceData] = useState({});
  const [searchMarker, setSearchMarker] = useState(null);
  const searchBoxRef = useRef(null);

  const onLoadMap = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const calculateDistances = useCallback(() => {
    if (!window.google) return;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [propertyLocation],
        destinations: places.map(p => ({ lat: p.lat, lng: p.lng })),
        travelMode: 'DRIVING'
      },
      (response, status) => {
        if (status === 'OK') {
          const elements = response.rows[0].elements;
          const updated = {};
          places.forEach((place, idx) => {
            updated[place.name] = elements[idx];
          });
          setDistanceData(updated);
        }
      }
    );
  }, []);

  React.useEffect(() => {
    if (isLoaded) calculateDistances();
  }, [isLoaded, calculateDistances]);

  const handleSearch = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;
    const place = places[0];
    const location = place.geometry.location;
    const newLoc = {
      lat: location.lat(),
      lng: location.lng()
    };
    setSearchMarker({ name: place.name, position: newLoc });
    map.panTo(newLoc);
    map.setZoom(14);
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <>
      <div className="p-4">
        <StandaloneSearchBox onLoad={ref => (searchBoxRef.current = ref)} onPlacesChanged={handleSearch}>
          <input
            type="text"
            placeholder="Search for any location..."
            className="w-full p-3 rounded-md border border-gray-300 mb-4"
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={propertyLocation}
        zoom={13}
        onLoad={onLoadMap}
      >
        {/* Main Property Marker */}
        <Marker
  position={propertyLocation}
  title="Your Property"
  icon={{
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/homegardenbusiness.png', // You can change this to a custom image
    scaledSize: new window.google.maps.Size(50, 50), // Set marker size here
  }}
/>


        {/* Markers for Nearby Places */}
        {places.map((place, idx) => (
          <Marker
            key={idx}
            position={{ lat: place.lat, lng: place.lng }}
            label={place.icon}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {/* Search result marker */}
        {searchMarker && (
          <Marker
            position={searchMarker.position}
            label="📍"
            onClick={() => setSelectedPlace(searchMarker)}
          />
        )}

        {/* Info Windows */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.position || {
              lat: selectedPlace.lat,
              lng: selectedPlace.lng
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h4>{selectedPlace.name}</h4>
              {distanceData[selectedPlace.name] ? (
                <p>
                  Distance: {distanceData[selectedPlace.name].distance.text}<br />
                  Duration: {distanceData[selectedPlace.name].duration.text}
                </p>
              ) : (
                <p>{searchMarker ? 'Searched location' : 'Loading...'}</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
};

export default PropertyMap;
