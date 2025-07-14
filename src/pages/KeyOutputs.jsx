import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/App.module.css';

function getImageUrl(media) {
  return media?.data?.attributes?.url
    ? 'http://localhost:1337' + media.data.attributes.url
    : '';
}

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <img
        src={
          article.attributes.image?.data?.attributes?.url
            ? 'http://localhost:1337' + article.attributes.image.data.attributes.url
            : ''
        }
        alt=""
        className="article-img"
      />
      <div className="article-content">
        <h3>{article.attributes.title}</h3>
        <p>{article.attributes.summary}</p>
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const [showPlayer, setShowPlayer] = useState(false);

  let thumbUrl = '';
  if (Array.isArray(video.thumbnail) && video.thumbnail.length > 0) {
    const thumbObj = video.thumbnail[0];
    thumbUrl =
      thumbObj.formats?.small?.url ||
      thumbObj.formats?.thumbnail?.url ||
      '';
    if (thumbUrl && !thumbUrl.startsWith('http')) {
      thumbUrl = 'http://localhost:1337' + thumbUrl;
    }
  }

  const isYouTube = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be');

  return (
    <div className={styles['video-cards']}>
      {!showPlayer ? (
        <div className={styles['video-card']}
          onClick={() => setShowPlayer(true)}
        >
          {thumbUrl && (
            <img src={thumbUrl} alt="" className="video-thumb" />
          )}
          {/* play button */}
          <span className={styles['video-play-button']}>▶</span>
        </div>
      ) : (
        <div className={styles['video-player']}>
          {isYouTube ? (
            <iframe
              src={video.videoUrl.replace('watch?v=', 'embed/')}
              title={video.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video width="100%" height="315" controls autoPlay>
              <source src={video.videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      <div className={styles['video-title']}>{video.videoTitle}</div>
    </div>
  );
}

export default function KeyOutputs() {
  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch('/content/outputs.md')
      .then(res => res.text())
      .then(text => {
        const sections = text.split('<!-- split -->');
        setSections(sections);
      });
    fetch('http://localhost:1337/api/articles?populate=*')
      .then(res => res.json())
      .then(data => setArticles(data.data || []));
    fetch('http://localhost:1337/api/videos?populate=*')
      .then(res => res.json())
      .then(data => setVideos(data.data));
  }, []);

  return ( 
    <div className={styles.intro_wrapper}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections[0]}</ReactMarkdown>
      <div className={styles['article-list']}>
      <div className={styles['article-cards']}>
          {articles.map(article => (
            <div className={styles['article-card']} key={article.id}>
              {Array.isArray(article.image) && article.image[0]?.url && (
                <img
                  src={'http://localhost:1337' + article.image[0].url}
                  alt=""
                  className={styles['article-card-img']}
                />
              )}
              <div>
                <h3>
                  {article.articleTitle}
                </h3>
                <p>
                  {article.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


        <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections[1]}</ReactMarkdown>

          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
      
    </div>
  );
}