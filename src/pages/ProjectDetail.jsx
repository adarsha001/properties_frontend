import React from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const projects = [
  {
    id: 1,
    title: "Hoskote Meadows",
    location: "Hoskote",
    image: "/images/hoskote-project.jpg",
    description: "Luxury villas with modern amenities near Bangalore",
    status: "Completed",
    details: "Spread over 5 acres, Hoskote Meadows offers 2BHK and 3BHK villas with premium finishes, clubhouse, swimming pool, and 24/7 security. Located just 25 minutes from Bangalore city center.",
    features: [
      "Gated community with 100% power backup",
      "Landscaped gardens and jogging track",
      "Children's play area",
      "Proximity to schools and hospitals"
    ]
  },
  {
    id: 2,
    title: "Yelanka Greens",
    location: "Yelanka",
    image: "/images/yelanka-project.jpg",
    description: "Premium apartments with smart home features",
    status: "Ongoing",
    details: "Modern 1BHK and 2BHK apartments with smart home automation, modular kitchens, and premium flooring. Expected completion in Q4 2025.",
    features: [
      "Smart home automation system",
      "Rainwater harvesting",
      "Solar panels for common areas",
      "EV charging stations"
    ]
  },
  {
    id: 3,
    title: "Whitefield Heights",
    location: "Whitefield",
    image: "/images/whitefield-project.jpg",
    description: "Commercial complex with retail spaces",
    status: "Upcoming",
    details: "Mixed-use development with office spaces, retail outlets, and food courts. Pre-booking available with special launch offers.",
    features: [
      "Premium office spaces from 1000 sq.ft.",
      "Retail spaces with high visibility",
      "Ample parking space",
      "Dedicated service elevators"
    ]
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === parseInt(id));

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link 
        to="/projects" 
        className="flex items-center text-teal-600 hover:text-teal-800 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back to Projects
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
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

          <p className="text-lg mb-6">{project.details}</p>
          
          <h2 className="text-xl font-semibold mb-3">Key Features</h2>
          <ul className="list-disc pl-5 space-y-2 mb-8">
            {project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProjectDetail