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
  { name: 'Manipal Hospital', lat: 13.0541408, lng: 77.7176502, icon: '🏥' },
  { name: 'Delhi Public School', lat: 13.0503197, lng: 77.7146563, icon: '🎓' },
  { name: 'Udupi Restaurant', lat: 13.0528715, lng: 77.7190537, icon: '🍽️' },
  { name: 'Gym', lat: 13.0550796, lng: 77.7177279, icon: '💪' }
];

const PropertyMap = ({ bgChanged }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyB5phvaZM_0OCNCM_cRiCFUHPYiKg0jEG8',
    libraries: ['places']
  });

  const [map, setMap] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [distanceData, setDistanceData] = useState({});
  const [searchMarker, setSearchMarker] = useState(null);
  const searchBoxRef = useRef(null);

  // Dark mode classes
  const darkBg = bgChanged ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-blue-100';
  const darkText = bgChanged ? 'text-gray-100' : 'text-gray-800';
  const darkBorder = bgChanged ? 'border-gray-700' : 'border-gray-300';
  const darkCardBg = bgChanged ? 'bg-gray-800' : 'bg-purple-50';
  const darkCardBorder = bgChanged ? 'border-purple-700' : 'border-purple-500';
  const darkHighlightText = bgChanged ? 'text-teal-300' : 'text-teal-700';

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

  if (!isLoaded) return (
    <div className={`p-4 ${darkBg} ${darkText} min-h-[90vh] flex items-center justify-center`}>
      <p>Loading map...</p>
    </div>
  );

  return (
    <div className={`${darkBg} ${darkText} p-12` }>
      <div className="p-4">
        <StandaloneSearchBox 
          onLoad={ref => (searchBoxRef.current = ref)} 
          onPlacesChanged={handleSearch}
        >
          <input
            type="text"
            placeholder="Search for any location..."
            className={`w-full p-3 rounded-md border ${darkBorder} ${bgChanged ? 'bg-gray-700 text-white' : 'bg-white'} mb-4`}
          />
        </StandaloneSearchBox>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={propertyLocation}
        zoom={17}
        onLoad={onLoadMap}
        options={{
          styles: bgChanged ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
              featureType: "administrative.locality",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#d59563" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }]
            }
          ] : []
        }}
      >
        {/* Main Property Marker */}
        <Marker
          position={propertyLocation}
          title="Your Property"
          icon={{
            url: bgChanged 
              ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              : 'https://maps.gstatic.com/mapfiles/ms2/micons/homegardenbusiness.png',
            scaledSize: new window.google.maps.Size(50, 50),
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
            <div className={`p-2 ${bgChanged ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
              <h4 className="font-bold">{selectedPlace.name}</h4>
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

      <div className='h-8'></div>
      
      <div className={`${darkCardBg} p-6 rounded-lg border-l-4 ${darkCardBorder} mx-4 mb-8`}>
        <h2 className={`text-lg font-bold ${darkHighlightText} mb-3`}>Time-to-Place</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: '🚘', text: '15 mins from Old Madras Road' },
            { icon: '🚘', text: '5 mins from Airport Road' },
            { icon: '🚘', text: '40 mins from ITPL' },
            { icon: '🚘', text: '25 mins from KR Puram' },
            { icon: '🚘', text: '45 mins from Airport' },
            { icon: '🚘', text: '10 mins from Schools/Hospitals' }
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <span className={`mr-2 ${bgChanged ? 'text-purple-400' : 'text-purple-600'}`}>{item.icon}</span>
              <span className={bgChanged ? 'text-gray-200' : ''}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PropertyMap;