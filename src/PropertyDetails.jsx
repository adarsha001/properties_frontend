import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FiMapPin,
  FiDollarSign,
  FiHome,
  FiLayers,
  FiImage,
  FiClock,
  FiStar,
  FiNavigation
} from 'react-icons/fi';
import PropertyList from './PropertyList';
import api from '../api';
import UserPromptModal from '../main/UserPromptModal';



const PropertyDetails = () => {
  const { id } = useParams();
  // const [property, setProperty] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // useEffect(() => {
  //   const fetchProperty = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await api.get(`/api/properties/${id}`);
  //       setProperty(res.data);
  //     } catch (err) {
  //       console.error('Error fetching property:', err);
  //       setError('Failed to load property details. Please try again later.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProperty();
  // }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto p-6 text-center text-red-500">
      {error}
    </div>
  );

  if (!property) return (
    <div className="max-w-6xl mx-auto p-6 text-center text-gray-500">
      Property not found
    </div>
  );

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <a href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-teal-600">
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Properties</span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-700 md:ml-2 truncate max-w-[120px]">{property.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Title and Price */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{property.name}</h1>
     
      </div>

      {/* Location and Rating */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
        <div className="flex items-center text-gray-700">
          <FiMapPin className="mr-2 text-teal-500" />
          <span>{property.location}</span>
        </div>
        {property.rating && (
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{property.rating}</span>
          </div>
        )}
      </div>

      {/* Main Image Gallery */}
      {property.images?.length > 0 && (
        <div className="mb-8">
         <div className="relative mb-4 overflow-hidden rounded-xl shadow-lg">
  <img
    src={property.images[activeImage].url}
    alt={`Property main view`}
    className="w-full h-auto max-h-[80vh] object-contain mx-auto"
  />
            {property.featured && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {property.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`rounded-lg overflow-hidden shadow-sm transition-all ${activeImage === index ? 'ring-2 ring-teal-500' : 'hover:ring-1 hover:ring-gray-300'}`}
              >
               <img
  src={img.url}
  alt={`Property thumbnail ${index + 1}`}
  className="w-full h-24 object-contain p-1"
  style={{ background: '#f9fafb' }}
/>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Main Details */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Property Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiHome className="text-teal-500 mr-2" />
                <span className="font-medium">Type</span>
              </div>
              <p className="text-gray-700">{property.type || 'Residential'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiLayers className="text-teal-500 mr-2" />
                <span className="font-medium">Area</span>
              </div>
              <p className="text-gray-700">{property.squarefeet} sq.ft</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiImage className="text-teal-500 mr-2" />
                <span className="font-medium">Bedrooms</span>
              </div>
              <p className="text-gray-700">{property.beds}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FiClock className="text-teal-500 mr-2" />
                <span className="font-medium">Building Age</span>
              </div>
              <p className="text-gray-700">{property.building_age || 'New Construction'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description || 'No description available for this property.'}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                <span className="text-teal-600 font-medium text-lg">A</span>
              </div>
              <div>
                <p className="font-medium">Agent Name</p>
                <p className="text-sm text-gray-500">Real Estate Agent</p>
              </div>
            </div>
            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Request Info
            </button>
          </div>

   {property.map_url && (
  <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <FiNavigation className="text-teal-500 mr-2" />
      Street View
    </h3>

<div className="aspect-video w-full rounded-lg overflow-hidden shadow">
      <iframe
        src={property.map_url}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>

    <a 
      href={property.map_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block mt-3 text-teal-600 hover:text-teal-800 text-sm font-medium"
    > 
      View in Google Maps
    </a>
  </div>
)}

        </div>
      </div>
      {/* <div>  </div> */}
      {/* <div><UserPromptModal/></div>
      <div>    <PropertyList/></div> */}
    </div>
  );
};

export default PropertyDetails;