import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/App.module.css';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/articles/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data));
  }, [id]);

  if (!article) return <div>Loading...</div>;
  

  return (
    <div className={styles.intro_wrapper}>
      <h1>{article.title}</h1>
      <img
        src={`http://localhost:3001${article.image}`}
        alt=""
        style={{ width: '100%', maxWidth: '800px', marginBottom: 20 }}
      />
      <ReactMarkdown>{article.content}</ReactMarkdown>
    </div>
  );
}
