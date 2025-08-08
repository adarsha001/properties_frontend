// Projects.jsx
import React, { useState } from 'react';
import { useParams, Link, Routes, Route, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';

const ProjectsComponent = () => {
  // Projects data
  const projects = [
    {
      id: 1,
      title: "Hoskote Meadows",
      location: "Hoskote",
      image: "/images/hoskote-project.jpg",
      description: "Luxury villas with modern amenities near Bangalore",
      status: "Completed",
      details: "Spread over 5 acres, Hoskote Meadows offers 2BHK and 3BHK villas with premium finishes, clubhouse, swimming pool, and 24/7 security.",
      features: [
        "Gated community with 100% power backup",
        "Landscaped gardens and jogging track",
        "Children's play area"
      ]
    },
    {
      id: 2,
      title: "Yelanka Greens",
      location: "Yelanka",
      image: "/images/yelanka-project.jpg",
      description: "Premium apartments with smart home features",
      status: "Ongoing",
      details: "Modern 1BHK and 2BHK apartments with smart home automation, modular kitchens, and premium flooring.",
      features: [
        "Smart home automation system",
        "Rainwater harvesting",
        "Solar panels for common areas"
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
    <div className="max-w-6xl mx-auto px-4 py-12">
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






