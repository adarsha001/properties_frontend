import React, { useState } from 'react';
import { FiHome, FiMapPin, FiDollarSign, FiLayers } from 'react-icons/fi';

const App = () => {
  const [bgChanged, setBgChanged] = useState(false);

  const handleImageClick = () => {
    setBgChanged(prev => !prev); 
  };

  // Conditional classes
  const headingTextClass = bgChanged ? 'text-white' : 'text-gray-800';
  const featureTextClass = bgChanged ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`w-full px-4 md:px-10 flex justify-center items-center min-h-screen transition-colors duration-500 ${bgChanged ? 'bg-black' : 'bg-white'}`}>
      <div className="cntnr w-full h-full md:h-[80%] flex flex-col md:flex-row items-center md:items-stretch gap-8">
        
        {/* Left Image Section */}
        <div className="limg w-full md:w-[40%] relative h-64 md:h-full flex justify-center items-center">
          <div className="absolute w-[120%] h-[120%] bg-gray-100 skew-y-6 rounded-xl shadow-xl -z-10" />
          
          {/* Clickable Image */}
          <img
            className="z-10 w-40 md:w-60 object-contain cursor-pointer"
            src={`${bgChanged ? '../public/black.png' : '../public/grad.png'}`}
            alt="Property Visual"
            onClick={handleImageClick}
          />
        </div>

        {/* Right Features Section */}
        <div className="right w-full md:w-[60%] flex flex-col justify-center gap-6">
          <h2 className={`text-3xl font-bold ${headingTextClass}`}>Garudan Properties</h2>
          <ul className="space-y-4">
            <li className={`flex items-center gap-4 text-lg ${featureTextClass}`}>
              <FiHome className="text-blue-500" size={24} />
              3BHK Luxury Apartments with Modern Interiors
            </li>
            <li className={`flex items-center gap-4 text-lg ${featureTextClass}`}>
              <FiMapPin className="text-green-500" size={24} />
              Prime Location – Whitefield, Bangalore
            </li>
            <li className={`flex items-center gap-4 text-lg ${featureTextClass}`}>
              <FiDollarSign className="text-yellow-500" size={24} />
              Affordable Pricing with Easy EMI Options
            </li>
            <li className={`flex items-center gap-4 text-lg ${featureTextClass}`}>
              <FiLayers className="text-purple-500" size={24} />
              Amenities: Gym, Pool, Clubhouse & Security
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
