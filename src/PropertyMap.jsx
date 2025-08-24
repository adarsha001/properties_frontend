import React from 'react';

const PropertyMap = ({ bgChanged }) => {
  const darkBg = bgChanged ? 'bg-gradient-to-br from-black to-gray-900' : 'bg-gradient-to-br from-blue-50 to-blue-100';
  const darkText = bgChanged ? 'text-gray-100' : 'text-gray-800';
  const darkCardBg = bgChanged ? 'bg-gray-800' : 'bg-purple-50';
  const darkCardBorder = bgChanged ? 'border-gray-700' : 'border-gray-500';
  const darkHighlightText = bgChanged
    ? 'bg-gradient-to-r from-gray-100 via-gray-900 to-gray-900 bg-clip-text text-transparent'
    : 'bg-gradient-to-l from-gray-100 via-gray-600 to-gray-700 bg-clip-text text-transparent';

  const locations = [
    { icon: '🚘', text: 'Udigere - 5.8km (15 min)' },
    { icon: '🚘', text: 'Avalahalli - 6km (15 min)' },
    { icon: '🚘', text: 'Rammurthy Nagar - 18km (35 min)' },
    { icon: '🚘', text: 'Ayapanagar - 17km (30 min)' },
    { icon: '🚘', text: 'Hoodi - 19km (35 min)' },
    { icon: '🚘', text: 'Whitefield - 18km (30 min)' },
    { icon: '🚘', text: 'Airport Road - 4km (5 min)' },
    { icon: '🚘', text: 'Yelahanka - 16km (30 min)' },
    { icon: '🚘', text: 'Bagalur - 8.2km (15 min)' }
  ];

  return (
    <div className={`${darkBg} ${darkText} py-4 px-4 sm:px-6`}>
      {/* Google Maps Embed (Optional)
      <div className="pt-4 sm:pt-0 w-full flex justify-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d658.9128515519533!2d77.72361453769636!3d13.04369393594722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1753883696394!5m2!1sen!2sin"
          width="100%"
          height="450"
          allowFullScreen=""
          loading="lazy"
          style={{ border: 0, borderRadius: '0.5rem' }}
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div> */}

      <div className="h-6"></div>

      <div className={`${darkCardBg} p-6 rounded-lg border-l-4 ${darkCardBorder} mx-4 mb-8`}>
        <h2 className={`text-lg font-bold ${darkHighlightText} mb-3`}>Time-to-Place</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {locations.map((item, index) => (
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
