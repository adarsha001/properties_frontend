import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const reviewCards = [
  // ... (keep your existing reviewCards array)
];

const InfiniteScroller = ({ bgChanged }) => {
  const scrollerRef = useRef(null);
  const innerRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const wrapperRef = useRef(null);
  const [clickedIndex, setClickedIndex] = useState(null);

  // Style variables
  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const cardBg = bgChanged ? "bg-gray-800" : "bg-white";
  const wrapperBg = bgChanged ? "bg-gradient-to-tr from-black to-gray-900" : "bg-gradient-to-br from-blue-50 to-blue-100";
  const subTextColor = bgChanged ? "text-gray-400" : "text-gray-500";
  const emptyStarColor = bgChanged ? "text-gray-600" : "text-gray-300";
  const reviewCards = [
  {
    name: "Deena Prabha",
    role: "Home Buyer",
    image: "../../WhatsApp Image 2025-07-25 at 3.17.43 PM.jpeg",
    review: "SP properties was absolutely wonderful at finding property that met all of our requirements. They took the time to thoroughly explain the property details before we decided to move forward with it I wouldnt hesitate to recommend SP properties.",
    rating: 5,
  },
  {
    name: "Navya Nagappa",
    role: "Investor",
    image: "../../WhatsApp Image 2025-07-25 at 3.35.24 PM.jpeg",
    review: "Outstanding communication. Had a great experience with SP Properties. I have to say that I am thoroughly happy with the speed, reliability, and dedication of the team to provide an excellent service and to get our properties fully tenanted in a very short time.",
    rating: 5,
  },
  {
    name: "Mohith M",
    role: "Seller",
    image: "../../WhatsApp Image 2025-07-25 at 3.41.05 PM.jpeg",
    review: "If you're seeking a trusted and results-driven real estate consultant, look no further. Their expertise and passion for delivering exceptional service make them unparalleled in the industry.",
    rating: 5,
  },
  {
    name: "Deekshith Dinu",
    role: "Relocation Client",
    image: "../../WhatsApp Image 2025-07-25 at 3.33.54 PM.jpeg",
    review: "Impressed by The SP Properties commitment to customer satisfaction! The team went above and beyond to address every question, making the process seamless and stress-free.",
    rating: 5,
  },  {
    name: "Satyajit",
    role: "Relocation Client",
    image: "../../WhatsApp Image 2025-08-16 at 12.56.52 PM.jpeg",
    review: "Superb Work! Really impressed with the quick and smooth process of providing land to my friends within just 2–3 days. The registration process was seamless, and the overall deal was handled very efficiently.Special thanks to Praveen & Subhash for their outstanding support and dedication throughout the entire process. 🙌👏",
    rating: 5,
  },  {
    name: "Rajasmitha",
    role: "Relocation Client",
    image: "../../WhatsApp Image 2025-08-16 at 1.00.00 PM.jpeg",
    review: "SP properties is the right place for searching plots in East Bengaluru. Excellent team, Good service",
    rating: 5,
  },
];

  useEffect(() => {
    const setupAnimation = () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      
      if (!reducedMotion && scrollerRef.current && innerRef.current) {
        const items = innerRef.current.querySelectorAll(".review-card");
        
        if (items.length === 0) return;

        const itemWidth = items[0].offsetWidth;
        const gap = 24; // gap-6 = 1.5rem = 24px
        const totalWidth = (itemWidth + gap) * items.length;

        // Kill existing animation if any
        if (animationRef.current) animationRef.current.kill();

        // Set initial position
        gsap.set(innerRef.current, { x: 0 });

        // Create seamless loop animation
        animationRef.current = gsap.to(innerRef.current, {
          x: -totalWidth / 2, // Only move half way since we duplicated items
          duration: items.length * 3, // Dynamic duration based on item count
          ease: "none",
          repeat: -1,
          onRepeat: () => {
            // Jump back to start position seamlessly
            gsap.set(innerRef.current, { x: 0 });
            animationRef.current.progress(0);
          },
          paused: !isPlaying
        });
      }
    };

    setupAnimation();

    const handleResize = () => {
      setupAnimation();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) animationRef.current.kill();
    };
  }, [isPlaying]);

  const handleCardClick = (index, e) => {
    e.stopPropagation(); // Prevent triggering the container click
    
    if (!innerRef.current || !animationRef.current) return;

    const items = innerRef.current.querySelectorAll(".review-card");
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth;
    const gap = 24;
    
    // Calculate the target position to center the clicked card
    const targetX = -(index * (itemWidth + gap)) + (scrollerRef.current.offsetWidth / 2 - itemWidth / 2);
    
    // Pause the animation
    animationRef.current.pause();
    setIsPlaying(false);
    
    // Animate to the target position
    gsap.to(innerRef.current, {
      x: targetX,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        setClickedIndex(index % reviewCards.length); // Store the original index (not duplicated)
      }
    });
  };

  const toggleAnimation = () => {
    if (!animationRef.current) return;
    
    if (isPlaying) {
      animationRef.current.pause();
      setIsPlaying(false);
    } else {
      // When resuming, reset to loop animation
      setClickedIndex(null);
      animationRef.current.play();
      setIsPlaying(true);
    }
  };

  // Duplicate reviews for seamless looping
  const duplicatedReviews = [...reviewCards, ...reviewCards];

  return (
    <div className={`flex flex-col items-center gap-10 py-16 ${wrapperBg}`} ref={wrapperRef}>
      <h1 className={`text-3xl font-bold text-center ${textColor}`}>What Our Clients Say</h1>

      <div 
        className="scroller w-full overflow-hidden relative"
        ref={scrollerRef}
        onClick={toggleAnimation}
        style={{ cursor: "pointer" }}
      >
        <div className="scroller__inner flex gap-6 w-max px-4 py-2" ref={innerRef}>
          {duplicatedReviews.map((review, index) => (
            <div
              key={`${review.name}-${index}`}
              className={`review-card w-72 flex-shrink-0 rounded-xl shadow-md p-6 transition-all hover:scale-[1.02] ${cardBg} ${
                clickedIndex === index % reviewCards.length ? 'ring-2 ring-blue-500 scale-[1.02]' : ''
              }`}
              onClick={(e) => handleCardClick(index, e)}
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

              <div className="flex mb-3">
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

              <p className={`text-sm leading-relaxed ${textColor}`}>{review.review}</p>
            </div>
          ))}
        </div>

        {/* Pause/Play Indicator */}
        <div className={`absolute right-4 top-4 text-xs px-2 py-1 rounded-full ${bgChanged ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {isPlaying ? 'Pause' : 'Play'}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroller;





