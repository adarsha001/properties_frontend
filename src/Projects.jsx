// Projects.jsx
import React, { useState } from 'react';
import { useParams, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';

const ProjectsComponent = () => {
const projects = [
 
  {
    id: 3,
    title: "Sri Sai Dwaraka Kammasandra",
    location: "Kammasandra, Near Old Madras Road",
    image: "../public/ssdkammasandra.JPG",
    description: "Premium residential layout with modern infrastructure",
    status: "Completed (2023)",
    details: "A well-planned gated community featuring underground drainage, electrical systems, landscaped parks, wide roads, and 24/7 security.",
    features: [
      "Individual water and power connections",
      "Well-marked street signage",
      "Surveillance security system",
      "Close to international schools and hospitals"
    ]
  },
  {
    id: 4,
    title: "Urban Feet Layout",
    location: "Channasandra, Whitefield",
image: "../public/uf.JPG",
    description: "Sold-out luxury gated community",
    status: "Completed (Sold Out)",
    details: "BBMP A-Khata gated layout featuring ready-to-build plots with world-class infrastructure near ITPL.",
    features: [
      "TAR roads and underground drainage",
      "Individual Kaveri and borewell water connections",
      "Dedicated gas pipelines",
      "2 KM from ITPL and Metro Station"
    ]
  },
  {
    id: 5,
    title: "RKB Enclave",
    location: "Doddagattinabbe, Hoskote–Whitefield Main Road",
image: "../public/rkb.JPG",
    description: "STRR-approved villa plot development",
    status: "Completed",
    details: "2.06 acre development with 27 plots featuring top-tier infrastructure and lifestyle amenities.",
    features: [
      "30 ft and 40 ft wide asphalted roads",
      "Landscaped park with jogging track",
      "9 KM from ITPL",
      "6 KM from Kadugodi Metro"
    ]
  },
  {
    id: 6,
    title: "Sunrise Meadows",
    location: "Hoskote, Near Caldwell Academy School",
  image: "../public/sunrise.JPG",
    description: "Residential plotted development",
    status: "Completed",
    details: "2 acre development with 36 DC Converted, E-Katha plots featuring essential infrastructure.",
    features: [
      "30 ft wide concrete roads",
      "Underground sewage system",
      "Roadside tree plantation",
      "Excellent connectivity to Whitefield"
    ]
  },
  {
    id: 7,
    title: "Sai Samrudhi Layout",
    location: "Marsandra",
 image: "../public/saisamrudhi.JPG",
    description: "Premium DC Converted residential enclave",
    status: "Completed",
    details: "Panchayat approved layout with E-Khata and building approval for G+3 floors.",
    features: [
      "Well-laid TAR roads",
      "Underground drainage",
      "10 km from Old Madras Road",
      "15 km from Kempegowda International Airport"
    ]
  },
  {
    id: 8,
    title: "Sri Sai Dwaraka Gunduru",
    location: "Gunduru, Near Budigere Cross",

image: "./public/ssdgundur.JPG",
    description: "Premium E-Khata gated community",
    status: "Ongoing",
    details: "Successor to Sri Sai Dwaraka Kammasandra, offering plots with excellent connectivity near Airport Road.",
    features: [
      "CC Roads",
      "Underground & rainwater drainage",
      "Building Approval for G+3",
      "Near Brigade Signature Tower and ORION Mall"
    ]
  },
  {
    id: 9,
    title: "Avalahalli Gated Community",
    location: "Avalahalli",
image: "../public/hirandali.JPG",
    description: "Premier E-Khata gated community",
    status: "Ongoing",
    details: "Successor to Urban Feat Layout, positioned close to National Highway-75 and Airport Parallel Road.",
    features: [
      "TAR Roads",
      "Underground & Rainwater Drainage",
      "G+3 Building Permission",
      "15 mins from Old Madras Road"
    ]
  },
  {
    id: 10,
    title: "Mandur Gated Community",
    location: "Mandur, Near Budigere Cross",
image: "../public/WhatsApp Image 2025-08-08 at 12.53.45 PM (2).jpeg",
    description: "Premium E-Khata gated community",
    status: "Ongoing",
    details: "Positioned in one of the fastest-growing investment corridors near National Highway-75.",
    features: [
      "TAR Roads",
      "Underground & Rainwater Drainage",
      "Building Approval – G+3",
      "5 mins from Airport Road"
    ]
  }
];

  // State for filter
  const [filter, setFilter] = useState('All');
  
  // Navigation hook
  const navigate = useNavigate();

  // Filter projects by status
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.status === filter);

  // Projects Listing View
  const ProjectsListing = () => (
    <div className="max-w-6xl  mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Projects</h1>
        <div className="flex space-x-2">
          {['All', 'Completed', 'Ongoing'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === status 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{project.location}</p>
              <p className="text-sm mb-4">{project.description}</p>
              <div className="flex items-center text-blue-600 text-sm">
                View Details <FiChevronRight className="ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Project Details View
  const ProjectDetails = () => {
    const { id } = useParams();
    const project = projects.find(p => p.id === parseInt(id));

    if (!project) {
      return (
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <button 
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:underline"
          >
            Back to Projects
          </button>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <FiArrowLeft className="mr-2" /> Back to Projects
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="h-full">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                  <p className="text-gray-600">{project.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 mb-6">{project.details}</p>
                
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Contact Sales Representative
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main component render
  return (
    <Routes>
      <Route index element={<ProjectsListing />} />
      <Route path=":id" element={<ProjectDetails />} />
    </Routes>
  );
};

export default ProjectsComponent;






