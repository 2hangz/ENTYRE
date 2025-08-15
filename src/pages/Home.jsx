import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
          }, 4000); // Slower transition for better UX
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
    setIsPlaying(false); // Pause auto-play when user manually selects
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
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>Loading banner content...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>Please wait while we fetch the latest updates</div>
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
      
      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 60, 105, 0.8)', // UCC Crest Blue
              color: '#FFB500', // UCC Crest Yellow
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

      {/* Play/Pause button */}
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

function renderSectionContent(section, idx) {
  if (!section) return null;
  if (section.type === 'text' || !section.type) {
    return (
      <div key={idx} style={{ fontFamily: "'FiraGO', sans-serif" }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {section.content || ''}
        </ReactMarkdown>
      </div>
    );
  } else if (section.type === 'image') {
    return (
      <img
        key={idx}
        src={section.content}
        alt={section.title || 'Content image'}
        style={{ 
          width: '100%', 
          margin: '16px 0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 60, 105, 0.06)'
        }}
      />
    );
  } else if (section.type === 'key-value') {
    let parsed = {};
    try {
      parsed = JSON.parse(section.content || '{}');
    } catch (e) {
      parsed = {};
    }
    return (
      <div key={idx} style={{ margin: '16px 0' }}>
        {Object.entries(parsed).map(([key, value], i) => (
          <div key={i}>
            <div className={styles.keyValue}>
              <strong className={styles.keyValueKey} style={{ 
                color: '#003C69',
                fontFamily: "'FiraGO', sans-serif"
              }}>
                {key}
              </strong>
              <div className={styles.keyValueValue} style={{ 
                fontFamily: "'FiraGO', sans-serif"
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

export default function Home() {
  const [sections, setSections] = useState([]);
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

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

  const collapsibleButtonStyle = {
    background: '#FFB500', // UCC Crest Yellow
    color: '#003C69', // UCC Crest Blue
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: "'FiraGO', sans-serif",
    transition: 'all 0.2s',
    minWidth: '40px'
  };

  return (
    <div className={styles.intro_wrapper}>
      <BannerCarousel />
      
      {/* Main content section */}
      <div style={{ fontFamily: "'FiraGO', sans-serif" }}>
        {renderSectionContent(sections[0], 0)}
      </div>

      {/* Collapsible sections with UCC styling */}
      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2 style={{ 
            fontFamily: "'Merriweather', Georgia, serif",
            color: '#003C69',
            margin: 0
          }}>
            {sections[1]?.title || ''}
          </h2>
          <button 
            onClick={() => setOpen1(open => !open)}
            style={collapsibleButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = '#ED9A22'; // UCC Gold
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#FFB500';
            }}
            aria-expanded={open1}
            aria-label={`${open1 ? 'Collapse' : 'Expand'} ${sections[1]?.title || 'section'}`}
          >
            {open1 ? "▲" : "▼"}
          </button>
        </div>
        {open1 && (
          <div className={styles.section_wrapper}>
            {renderSectionContent(sections[1], 1)}
          </div>
        )}
      </div>

      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2 style={{ 
            fontFamily: "'Merriweather', Georgia, serif",
            color: '#003C69',
            margin: 0
          }}>
            {sections[2]?.title || ''}
          </h2>
          <button 
            onClick={() => setOpen2(open => !open)}
            style={collapsibleButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = '#ED9A22';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#FFB500';
            }}
            aria-expanded={open2}
            aria-label={`${open2 ? 'Collapse' : 'Expand'} ${sections[2]?.title || 'section'}`}
          >
            {open2 ? "▲" : "▼"}
          </button>
        </div>
        {open2 && (
          <div className={styles.section_wrapper}>
            {renderSectionContent(sections[2], 2)}
          </div>
        )}
      </div>

      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2 style={{ 
            fontFamily: "'Merriweather', Georgia, serif",
            color: '#003C69',
            margin: 0
          }}>
            {sections[3]?.title || ''}
          </h2>
          <button 
            onClick={() => setOpen3(open => !open)}
            style={collapsibleButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = '#ED9A22';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#FFB500';
            }}
            aria-expanded={open3}
            aria-label={`${open3 ? 'Collapse' : 'Expand'} ${sections[3]?.title || 'section'}`}
          >
            {open3 ? "▲" : "▼"}
          </button>
        </div>
        {open3 && (
          <div className={styles.section_wrapper}>
            {renderSectionContent(sections[3], 3)}
          </div>
        )}
      </div>
    </div>
  );
}