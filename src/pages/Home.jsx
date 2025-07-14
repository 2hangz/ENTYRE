import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/App.module.css';

const BannerCarousel = () => {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    let timer;
    fetch('http://localhost:1337/api/home-page-banners?populate=*')
      .then(res => res.json())
      .then(data => {
        const banners = (data.data || []).map(item => {
          const bannerArr = item.Banner || [];
          const firstBanner = bannerArr[0];
          let imageUrl = firstBanner?.url ? 'http://localhost:1337' + firstBanner.url : '';
          return {
            url: imageUrl,
            alt: item.PicName || 'Banner Image',
            caption: item.PicName || '',
          };
        });
        setImages(banners);

        if (banners.length > 0) {
          timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length);
          }, 3500);
        }
      })
      .catch(err => console.error("Banner fetch error", err));

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  if (!images.length) {
    return (
      <div className={styles.bannerCarousel} style={{ minHeight: 260, background: '#f3f4f6' }}>
      </div>
    );
  }

  return (
    <div className={styles.bannerCarousel}>
      <img
        src={images[current].url}
        alt={images[current].alt}
        className={styles.bannerImage}
      />
      <div
        className={styles.bannerCaption}
      >
        {images[current].caption}
      </div>
      <div className={styles.bannerDots}>
        {images.map((_, idx) => (
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

export default function Home() {
  const [sections, setSections] = useState([]);
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'content/home.md')
      .then(res => res.text())
      .then(text => {
        const parts = text.split('<!-- split -->');
        setSections(parts);
      });
  }, []);

  return (
    <div className={styles.intro_wrapper}>
      <BannerCarousel />
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sections[0] || ''}
      </ReactMarkdown>

      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2>Project Overview</h2>
          <button onClick={() => setOpen1(open => !open)}>
            {open1 ? "▲" : "▼"}
          </button>
        </div>
        {open1 && (
          <div className={styles.section_wrapper}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections[1] || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2>Project Summary</h2>
          <button onClick={() => setOpen2(open => !open)}>
            {open2 ? "▲" : "▼"}
          </button>
        </div>
        {open2 && (
          <div className={styles.section_wrapper}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections[2] || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className={styles.collapsible_section}>
        <div className={styles.collapsible_section_header}>
          <h2>Project Abstract Graphic</h2>
          <button onClick={() => setOpen3(open => !open)}>
            {open3 ? "▲" : "▼"}
          </button>
        </div>
        {open3 && (
          <div className={styles.section_wrapper}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {sections[3] || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}