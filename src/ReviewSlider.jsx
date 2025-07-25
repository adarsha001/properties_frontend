import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./scrollAnimation.css";

const reviewCards = [
  {
    name: "deena prabha",
    role: "Home Buyer",
    image: "../../WhatsApp Image 2025-07-25 at 3.17.43 PM.jpeg",
    review: "SP properties was absolutely wonderful at finding property that met all of our requirements. They took the time to thoroughly explain the property details before we decided to move forward with it I wouldnt hesitate to recommend SP properties .",
    rating: 5,
  },
  {
    name: "Navya Nagappa",
    role: "Investor",
    image: "../../WhatsApp Image 2025-07-25 at 3.35.24 PM.jpeg",
    review: "Outstanding communication,Had a great experience with SP Properties,I have to say that I am thoroughly  happy with the speed, reliability,  and about dedication of the team to provide an excellent service and to get our  properties  fully tenanted  in a very short time...I wish you all the best SP Properties,,Keep it up...good luck",
    rating: 5,
  },
  {
    name: "Mohith m",
    role: "Sellers",
    image: "../../WhatsApp Image 2025-07-25 at 3.41.05 PM.jpeg",
    review: "If you're seeking a trusted and results-driven real estate consultant, look no further than . Their expertise and passion for delivering exceptional service make them unparalleled in the industry.",
    rating: 5,
  },
  
  {
    name: "Deekshith dinu",
    role: "Relocation Client",
    image: "../../WhatsApp Image 2025-07-25 at 3.33.54 PM.jpeg",
    review: "Impressed by The SS Propertys commitment to customer satisfaction! The team went above and beyond to address every question, making the process seamless and stress-free",
    rating: 5,
  },
];

const InfiniteScroller = ({ bgChanged }) => {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion && scrollerRef.current) {
      const inner = scrollerRef.current.querySelector(".scroller__inner");

      gsap.to(inner, {
        x: "-=50%",
        duration: 40,
        repeat: -1,
        ease: "none",
      });
    }
  }, []);

  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const cardBg = bgChanged ? "bg-gray-800" : "bg-white";
  const wrapperBg = bgChanged ? "bg-gradient-to-tr from-black to-gray-900" : "bg-gray-100";
  const subTextColor = bgChanged ? "text-gray-400" : "text-gray-500";
  const emptyStarColor = bgChanged ? "text-gray-600" : "text-gray-300";

  const allReviews = [...reviewCards, ...reviewCards]; // Duplicate reviews

  return (
    <div className={`flex flex-col items-center gap-10 py-16 ${wrapperBg}`}>
      <h1 className={`text-3xl font-bold text-center ${textColor}`}>What Our Clients Say</h1>

      <div className="scroller" data-speed="slow" ref={scrollerRef}>
        <div className="scroller__inner flex gap-6 w-max">
          {allReviews.map((review, index) => (
            <div
              key={index}
              className={`w-72 flex-shrink-0 rounded-xl shadow-md p-4 transition ${cardBg}`}
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className={`font-semibold ${textColor}`}>{review.name}</h4>
                  <p className={`text-sm ${subTextColor}`}>{review.role}</p>
                </div>
              </div>

              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? "text-yellow-400" : emptyStarColor
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className={`text-sm ${textColor}`}>{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroller;
