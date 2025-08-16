import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import styles from '../styles/App.module.css';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const baseApi = 'https://entyre-backend.onrender.com/api/banners';

  useEffect(() => {
    let timer;
    fetch(`${baseApi}`)
      .then(res => res.json())
      .then(data => {
        const bannersArr = Array.isArray(data) ? data : [];
        setBanners(bannersArr);

        if (bannersArr.length > 0 && isPlaying) {
          timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % bannersArr.length);
          }, 4000);
        }
      })
      .catch(err => console.error("Banner fetch error", err));

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDotClick = (index) => {
    setCurrent(index);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % banners.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length);
    setIsPlaying(false);
  };

  if (!banners.length) {
    return (
      <div className={styles.bannerCarousel} style={{ 
        minHeight: 260, 
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#003C69',
        fontFamily: "'FiraGO', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading latest updates...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Please wait while we fetch content</div>
        </div>
      </div>
    );
  }

  const currentBanner = banners[current];

  return (
    <div className={styles.bannerCarousel} style={{ position: 'relative' }}>
      <a href={currentBanner.link || "#"} tabIndex={-1}>
        <img
          src={currentBanner.imageUrl.startsWith('http')
            ? currentBanner.imageUrl
            : `https://entyre-backend.onrender.com${currentBanner.imageUrl}`
          }
          alt={currentBanner.title || 'Banner Image'}
          className={styles.bannerImage}
        />
      </a>
      
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(85, 149, 197, 0.8)',
              color: '#FFB500',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#FFB500';
              e.target.style.color = '#003C69';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 60, 105, 0.8)';
              e.target.style.color = '#FFB500';
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 60, 105, 0.8)',
              color: '#FFB500',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#FFB500';
              e.target.style.color = '#003C69';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 60, 105, 0.8)';
              e.target.style.color = '#FFB500';
            }}
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}

      <button
        onClick={handlePause}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0, 60, 105, 0.8)',
          color: '#FFB500',
          border: 'none',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: "'FiraGO', sans-serif",
          fontWeight: '500',
          transition: 'all 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#FFB500';
          e.target.style.color = '#003C69';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 60, 105, 0.8)';
          e.target.style.color = '#FFB500';
        }}
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      
      <div className={styles.bannerCaption} style={{ 
        background: 'rgba(0, 60, 105, 0.85)',
        fontFamily: "'FiraGO', sans-serif",
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {currentBanner.title}
      </div>
      
      <div className={styles.bannerDots}>
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`${styles.bannerDot} ${idx === current ? styles.activeBannerDot : ''}`}
            style={{
              background: idx === current ? '#FFB500' : 'rgba(255, 255, 255, 0.5)',
              border: idx === current ? '2px solid #ffffff' : '2px solid transparent',
              width: '12px',
              height: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => (
  <section style={{
    background: 'linear-gradient(135deg, #003C69 0%, #006087 100%)',
    color: 'white',
    padding: '60px 40px',
    borderRadius: '16px',
    marginBottom: '48px',
    textAlign: 'center'
  }}>
    <h1 style={{
      fontFamily: "'Merriweather', Georgia, serif",
      fontSize: '2.8rem',
      fontWeight: '700',
      marginBottom: '24px',
      lineHeight: '1.2',
      color: 'white'
    }}>
      Transforming Waste Tyres into Valuable Resources
    </h1>
    <p style={{
      fontSize: '1.3rem',
      fontFamily: "'FiraGO', sans-serif",
      maxWidth: '800px',
      margin: '0 auto 32px auto',
      lineHeight: '1.6',
      opacity: '0.95'
    }}>
      Explore innovative pathways for recycling End-of-Life Tyres (ELTs) in Ireland through 
      research-backed solutions and interactive decision-making tools.
    </p>
    <div style={{
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      <Link
        to="/pathway-explorer"
        style={{
          background: '#FFB500',
          color: '#003C69',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
          fontFamily: "'FiraGO', sans-serif",
          transition: 'all 0.2s',
          display: 'inline-block'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#ED9A22';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = '#FFB500';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        Explore Solutions →
      </Link>
      <Link
        to="/data-visualisation"
        style={{
          background: 'transparent',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '16px',
          fontFamily: "'FiraGO', sans-serif",
          border: '2px solid white',
          transition: 'all 0.2s',
          display: 'inline-block'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'white';
          e.target.style.color = '#003C69';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = 'white';
        }}
      >
        Compare Options
      </Link>
    </div>
  </section>
);

// Problem Statement Component
const ProblemSection = () => (
  <section style={{
    background: '#f8fafc',
    padding: '40px',
    borderRadius: '12px',
    marginBottom: '48px',
    border: '1px solid #e2e8f0'
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      alignItems: 'center'
    }}>
      <div>
        <h2 style={{
          fontFamily: "'Merriweather', Georgia, serif",
          color: '#003C69',
          fontSize: '2rem',
          marginBottom: '20px'
        }}>
          The Challenge in Ireland
        </h2>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          color: '#333',
          marginBottom: '16px'
        }}>
          Ireland generates approximately <strong>63,000 tonnes</strong> of End-of-Life Tyres annually, 
          presenting both an environmental challenge and a significant opportunity for resource recovery.
        </p>
        <p style={{
          fontSize: '1.1rem',
          lineHeight: '1.7',
          color: '#333'
        }}>
          Traditional disposal methods are no longer sustainable. We need innovative approaches 
          that transform waste tyres into valuable materials while supporting Ireland's circular economy goals.
        </p>
      </div>
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)'
      }}>
        <h3 style={{
          color: '#CE1F2C',
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          63,000
        </h3>
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '1.1rem',
          margin: '0'
        }}>
          tonnes of waste tyres<br />generated annually in Ireland
        </p>
      </div>
    </div>
  </section>
);

// Features Grid Component
const FeaturesSection = () => {
  const features = [
    {
      title: "Research Publications",
      description: "Access peer-reviewed studies, technical reports, and scientific findings on ELT valorisation methods.",
      icon: "📊",
      link: "/key-outputs",
      linkText: "View Research"
    },
    {
      title: "Interactive Pathways",
      description: "Explore step-by-step recycling processes from waste tyre collection to final products through visual workflows.",
      icon: "🔄",
      link: "/pathway-explorer",
      linkText: "Explore Pathways"
    },
    {
      title: "Decision Support Tools",
      description: "Use advanced analytics to compare different recycling options based on economic, environmental, and technical criteria.",
      icon: "⚖️",
      link: "/data-visualisation",
      linkText: "Analyze Options"
    }
  ];

  return (
    <section style={{ marginBottom: '48px' }}>
      <h2 style={{
        fontFamily: "'Merriweather', Georgia, serif",
        color: '#003C69',
        fontSize: '2.2rem',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        What This Platform Offers
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 60, 105, 0.08)',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 60, 105, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 60, 105, 0.08)';
            }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '16px'
            }}>
              {feature.icon}
            </div>
            <h3 style={{
              fontFamily: "'Merriweather', Georgia, serif",
              color: '#003C69',
              fontSize: '1.4rem',
              marginBottom: '16px'
            }}>
              {feature.title}
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
              marginBottom: '24px',
              fontSize: '1rem'
            }}>
              {feature.description}
            </p>
            <Link
              to={feature.link}
              style={{
                background: '#003C69',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                fontFamily: "'FiraGO', sans-serif",
                transition: 'all 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#006087';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#003C69';
              }}
            >
              {feature.linkText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

// Process Overview Component
const ProcessOverview = () => (
  <section style={{
    background: 'linear-gradient(135deg, #49C0B6 0%, #0A6836 100%)',
    color: 'white',
    padding: '48px 40px',
    borderRadius: '16px',
    marginBottom: '48px',
    textAlign: 'center'
  }}>
    <h2 style={{
      fontFamily: "'Merriweather', Georgia, serif",
      fontSize: '2.2rem',
      marginBottom: '32px'
    }}>
      From Waste to Value
    </h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {[
        { step: "1", title: "Collection", desc: "Gather end-of-life tyres" },
        { step: "2", title: "Processing", desc: "Transform through various pathways" },
        { step: "3", title: "Products", desc: "Create valuable materials" },
        { step: "4", title: "Impact", desc: "Benefit economy & environment" }
      ].map((item, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {item.step}
          </div>
          <h3 style={{
            fontSize: '1.2rem',
            marginBottom: '8px',
            fontFamily: "'FiraGO', sans-serif"
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: '0.9rem',
            opacity: '0.9',
            margin: '0'
          }}>
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default function Home() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch('https://entyre-backend.onrender.com/api/markdown')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.sectionIndex - b.sectionIndex);
        setSections(sorted);
      })
      .catch(err => {
        console.error('Failed to load dynamic homepage content:', err);
      });
  }, []);

  function renderSectionContent(section, idx) {
    if (!section) return null;
    const sectionTitle = section.title && section.title.trim() !== '' ? (
      <h3
        style={{
          fontFamily: "'FiraGO', sans-serif",
          color: '#003C69',
          fontWeight: 700,
          marginBottom: '12px',
          marginTop: 0,
          fontSize: '1.15rem',
          letterSpacing: '0.01em',
        }}
      >
        {section.title}
      </h3>
    ) : null;

    if (section.type === 'text' || !section.type) {
      return (
        <div key={idx} style={{ fontFamily: "'FiraGO', sans-serif" }}>
          {sectionTitle}
          <div>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.content || ''}
            </ReactMarkdown>
          </div>
        </div>
      );
    } else if (section.type === 'image') {
      return (
        <div key={idx} style={{ margin: '16px 0'}}>
          {sectionTitle}
          <div style={{ textAlign: 'left', marginLeft: 0 }}>
            <img
              src={section.content}
              alt={section.title || 'Content image'}
              style={{ 
                width: '100%', 
                margin: '',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 60, 105, 0.06)'
              }}
            />
          </div>
        </div>
      );
    } else if (section.type === 'key-value') {
      let parsed = {};
      try {
        parsed = JSON.parse(section.content || '{}');
      } catch (e) {
        parsed = {};
      }
      return (
        <div key={idx}>
          {sectionTitle}
          {Object.entries(parsed).map(([key, value], i) => (
            <div key={i}>
              <div className={styles.keyValue} style={{ textAlign: 'left', marginLeft: 15 }}>
                <strong className={styles.keyValueKey} style={{ 
                  color: '#003C69',
                  fontFamily: "'FiraGO', sans-serif",
                  textAlign: 'left'
                }}>
                  {key}
                </strong>
                <div className={styles.keyValueValue} style={{ 
                  fontFamily: "'FiraGO', sans-serif",
                  textAlign: 'left',
                  marginLeft: 0
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  return (
    <div className={styles.intro_wrapper}>
      <BannerCarousel />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <ProcessOverview />
      
      {/* Additional content from CMS if available */}
      {sections.length > 0 && (
        <section style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontFamily: "'Merriweather', Georgia, serif",
            color: '#003C69',
            fontSize: '2rem',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Latest Updates
          </h2>
          {sections.slice(0, 2).map((section, idx) => renderSectionContent(section, idx))}
        </section>
      )}
      
      {/* Call to Action */}
      <section style={{
        textAlign: 'center',
        padding: '48px 32px',
        background: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontFamily: "'Merriweather', Georgia, serif",
          color: '#003C69',
          fontSize: '1.8rem',
          marginBottom: '16px'
        }}>
          Ready to Explore Solutions?
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px auto'
        }}>
          Discover how different recycling pathways can transform Ireland's waste tyres into valuable resources.
        </p>
        <Link
          to="/pathway-explorer"
          style={{
            background: '#003C69',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '18px',
            fontFamily: "'FiraGO', sans-serif",
            transition: 'all 0.2s',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#006087';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#003C69';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Start Exploring →
        </Link>
      </section>
    </div>
  );
}