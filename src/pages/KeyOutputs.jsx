import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/App.module.css';
import { Link } from 'react-router-dom';

function ArticleCard({ article }) {
  // 检查是否有 _id，如果有则优先用 _id，否则用 id
  const articleId = article._id || article.id;
  return (
    <Link
      className={styles['article-card']}
      to={`/outputs/${articleId}`}
    >
      {article.imageUrl && (
        <img
          src={
            article.imageUrl.startsWith('http')
              ? article.imageUrl
              : `https://entyre-backend.onrender.com${article.imageUrl}`
          }
          alt=""
          className={styles['article-card-img']}
        />
      )}
      <div>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
      </div>
    </Link>
  );
}

function VideoCard({ video }) {
  const [showPlayer, setShowPlayer] = useState(false);

  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');

  return (
    <div className={styles['video-cards']}>
      {!showPlayer ? (
        <div
          className={styles['video-card']}
          onClick={() => setShowPlayer(true)}
        >
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt=""
              className={styles['video-thumb']}
            />
          )}
          <span className={styles['video-play-button']}>▶</span>
        </div>
      ) : (
        <div
          className={styles['video-player']}
        >
          {isYouTube ? (
            <iframe
              className={styles['video-frame']}
              src={video.videoUrl.replace('watch?v=', 'embed/')}
              title={video.title || video.videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              controls
              autoPlay
            >
              <source src={video.videoUrl} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
      <div className={styles['video-title']}>{video.title || video.videoTitle}</div>
    </div>
  );
}


export default function KeyOutputs() {
  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const baseApi = 'https://entyre-backend.onrender.com';

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'content/outputs.md')
      .then(res => res.text())
      .then(text => {
        const parts = text.split('<!-- split -->');
        setSections(parts);
      });

    fetch(`${baseApi}/api/articles`)
      .then(res => res.json())
      .then(data => {
        console.log('Articles:', data);
        setArticles(data || []);
      });

    fetch(`${baseApi}/api/videos`)
      .then(res => res.json())
      .then(data => setVideos(data));
  }, []);

  return (
    <div className={styles.intro_wrapper}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sections[0] || ''}
      </ReactMarkdown>

      <div className={styles['article-list']}>
        <div className={styles['article-cards']}>
          {articles.map(article => (
            <ArticleCard key={article._id || article.id} article={article} />
          ))}
        </div>
      </div>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {sections[1] || ''}
      </ReactMarkdown>

      {videos.map(video => (
        <VideoCard key={video.id || video._id} video={video} />
      ))}
    </div>
  );
}