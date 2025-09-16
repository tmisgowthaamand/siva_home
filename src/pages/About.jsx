import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Users, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    scrollToTop();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="about-page">
      <div className="container">
        {/* Back Button */}
        <button onClick={handleBackClick} className="back-button">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <div className="about-hero">
          <h1>About Siva Electronics & Home Appliances</h1>
          <p>Your trusted partner for premium electronics and home appliances since 2010</p>
        </div>

        {/* Company Story */}
        <div className="company-story">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2010, Siva Electronics & Home Appliances has been serving customers with 
              high-quality electronics and home appliances for over a decade. What started as a small 
              family business has grown into one of the most trusted electronics retailers in the region.
            </p>
            <p>
              We believe in providing our customers with the latest technology at competitive prices, 
              backed by exceptional customer service and comprehensive warranty support. Our commitment 
              to quality and customer satisfaction has made us the preferred choice for thousands of 
              happy customers.
            </p>
          </div>
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop" 
              alt="Our Store"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Brands</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">14+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>

        {/* Values */}
        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <Award size={48} />
              <h3>Quality First</h3>
              <p>We only stock products from trusted brands that meet our high quality standards.</p>
            </div>
            <div className="value-card">
              <Users size={48} />
              <h3>Customer Focus</h3>
              <p>Our customers are at the heart of everything we do. Your satisfaction is our priority.</p>
            </div>
            <div className="value-card">
              <Clock size={48} />
              <h3>Reliable Service</h3>
              <p>Fast delivery, professional installation, and prompt after-sales support.</p>
            </div>
            <div className="value-card">
              <MapPin size={48} />
              <h3>Local Expertise</h3>
              <p>Deep understanding of local needs and preferences with personalized service.</p>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="mission-vision">
          <div className="mission">
            <h3>Our Mission</h3>
            <p>
              To provide our customers with the best electronics and home appliances at competitive 
              prices, backed by exceptional service and support that exceeds expectations.
            </p>
          </div>
          <div className="vision">
            <h3>Our Vision</h3>
            <p>
              To be the leading electronics retailer in the region, known for quality products, 
              innovative solutions, and outstanding customer relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
