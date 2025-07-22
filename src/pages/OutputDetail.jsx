import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/App.module.css';

export default function OutputDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseApi = 'https://entyre-backend.onrender.com';

  useEffect(() => {
    setLoading(true);
    fetch(`${baseApi}/api/articles/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => {
        setArticle(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!article) return <div>Article not found.</div>;

  return (
    <div className={styles.intro_wrapper}>
      <h1>{article.title}</h1>
      {article.imageUrl && (
        <img
          src={
            article.imageUrl.startsWith('http')
              ? article.imageUrl
              : `${baseApi}${article.imageUrl}`
          }
          alt=""
          style={{ width: '100%', maxWidth: '800px', marginBottom: 20 }}
        />
      )}
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </div>
  );
}
