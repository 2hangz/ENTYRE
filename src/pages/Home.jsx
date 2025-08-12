import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/App.module.css';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const baseApi = 'https://entyre-backend.onrender.com/api/banners';

  useEffect(() => {
    let timer;
    fetch(`${baseApi}`)
      .then(res => res.json())
      .then(data => {
        const bannersArr = Array.isArray(data) ? data : [];
        setBanners(bannersArr);

        if (bannersArr.length > 0) {
          timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % bannersArr.length);
          }, 3500);
        }
      })
      .catch(err => console.error("Banner fetch error", err));

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  if (!banners.length) {
    return (
      <div className={styles.bannerCarousel} style={{ minHeight: 260, background: '#f3f4f6' }}>
      </div>
    );
  }

  const currentBanner = banners[current];

  return (
    <div className={styles.bannerCarousel}>
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
      <div className={styles.bannerCaption}>
        {currentBanner.title}
      </div>
      <div className={styles.bannerDots}>
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.bannerDot} ${idx === current ? styles.activeBannerDot : ''}`}
            onClick={() => setCurrent(idx)}
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
      <ReactMarkdown key={idx} remarkPlugins={[remarkGfm]}>
        {section.content || ''}
      </ReactMarkdown>
    );
  } else if (section.type === 'image') {
    return (
      <img
        key={idx}
        src={section.content}
        alt={section.title || ''}
        style={{ width: '100%', margin: '16px 0' }}
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
              <strong className={styles.keyValueKey}>{key}</strong>
              <div className={styles.keyValueValue}><ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown></div>
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

  return (
    <div className={styles.intro_wrapper}>
      <BannerCarousel />
      {renderSectionContent(sections[0], 0)}

      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2>{sections[1]?.title || ''}</h2>
          <button onClick={() => setOpen1(open => !open)}>
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
          <h2>{sections[2]?.title || ''}</h2>
          <button onClick={() => setOpen2(open => !open)}>
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
          <h2>{sections[3]?.title || ''}</h2>
          <button onClick={() => setOpen3(open => !open)}>
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