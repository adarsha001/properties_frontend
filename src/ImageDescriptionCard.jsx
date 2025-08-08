import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';

const ImageCardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 350px;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const DescriptionPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1.5rem;
  transform: translateY(100%);
  backdrop-filter: blur(5px);
`;

const Title = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #fff;
`;

const Description = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
`;

const ImageDescriptionCard = ({ imageUrl, title, description }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    const desc = descRef.current;

    // Initial setup
    gsap.set(desc, { y: '100%' });

    // Mouse enter animation
    const onEnter = () => {
      gsap.to(image, { scale: 1.1, duration: 0.5 });
      gsap.to(desc, { y: '0%', duration: 0.5, ease: 'power2.out' });
    };

    // Mouse leave animation
    const onLeave = () => {
      gsap.to(image, { scale: 1, duration: 0.5 });
      gsap.to(desc, { y: '100%', duration: 0.5, ease: 'power2.in' });
    };

    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <ImageCardContainer ref={containerRef}>
      <ImageWrapper>
        <StyledImage 
          ref={imageRef}
          src={imageUrl} 
          alt={title} 
        />
      </ImageWrapper>
      <DescriptionPanel ref={descRef}>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </DescriptionPanel>
    </ImageCardContainer>
  );
};

export default ImageDescriptionCard;