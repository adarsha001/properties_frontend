import React from 'react';

const PropertyMap = ({ bgChanged }) => {
  // Styling for light/dark themes
  const darkBg = bgChanged ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-blue-50 to-blue-100'; // Changed to 'to-b' for consistent gradient
  const darkText = bgChanged ? 'text-gray-100' : 'text-gray-800';
  const darkCardBg = bgChanged ? 'bg-gray-800' : 'bg-purple-50';
  const darkCardBorder = bgChanged ? 'border-gray-700' : 'border-gray-500';
  const darkHighlightText = bgChanged
    ? 'bg-gradient-to-r from-gray-100 via-gray-900 to-gray-900 bg-clip-text text-transparent'
    : 'bg-gradient-to-l from-gray-100 via-gray-600 to-gray-700 bg-clip-text text-transparent';

  return (
    <div className={`${darkBg} ${darkText} pt-0 px-0`}> {/* Removed all padding */}
      {/* Full-width map container */}
      <div className="w-full" style={{ height: '75vh' }}> {/* Increased height */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d658.9128515519533!2d77.72361453769636!3d13.04369393594722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1753883696394!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowFullScreen=""
          loading="lazy"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute left-0" 
        ></iframe>
      </div>

      {/* Content positioned over map */}
      <div className={`${darkCardBg} p-6 rounded-lg border-l-4 ${darkCardBorder} mx-4 mb-8 relative z-10 -mt-20`}> {/* Pulled up */}
        <h2 className={`text-lg font-bold ${darkHighlightText} mb-3`}>Time-to-Place</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: '🚘', text: '2 mins from Old Madras Road' },
            { icon: '🚘', text: '5 mins from Airport Road' },
            { icon: '🚘', text: '10 min from brigade signature towers' },
            { icon: '🚘', text: '30 mins from ITPL' },
            { icon: '🚘', text: '25 mins from KR Puram' },
            { icon: '🚘', text: '30 mins from manyatha tech park' },
            { icon: '🚘', text: '40 mins from Airport' },
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