import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../database'; // Make sure this imports your configured Firebase Firestore instance
import AuthRedirect from '../AuthRedirect';

const Articles = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const modalRef = useRef(null);
  const [likeStatus, setLikeStatus] = useState(null); // null: not rated, 1: liked, 0: disliked

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalVisible(false);
      }
    };

    if (isModalVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalVisible]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesCollection = collection(db, 'articles');
      const articleSnapshot = await getDocs(articlesCollection);
      const articleList = articleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userData = JSON.parse(localStorage.getItem('userData'));

      let filteredArticles = articleList;
      if (userData.specializationType === 'general') {
        filteredArticles = articleList.filter(article => article.speciality === userData.specialization);
      } else if (userData.specializationType === 'specialist') {
        filteredArticles = articleList.filter(article => 
          article.speciality === userData.specialization && 
          article.subspeciality === userData.subSpecialization
        );
      }

      // Sort articles by the number of likes and dislikes
      filteredArticles.sort((a, b) => {
        const aLikes = Object.values(a.raters || {}).filter(value => value === 1).length;
        const bLikes = Object.values(b.raters || {}).filter(value => value === 1).length;
        const aDislikes = Object.values(a.raters || {}).filter(value => value === 0).length;
        const bDislikes = Object.values(b.raters || {}).filter(value => value === 0).length;

        // Sort priority: no raters > fewer dislikes > more likes
        if (!a.raters) return -1;
        if (!b.raters) return 1;
        if (aDislikes !== bDislikes) return aDislikes - bDislikes;
        return bLikes - aLikes;
      });

      setArticles(filteredArticles);
    };

    fetchArticles();
  }, []);

  const handleReadClick = async (article) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userUID = userData.uid;
    const docRef = doc(db, 'articles', article.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const articleData = docSnap.data();
      const raters = articleData.raters || {};
      setLikeStatus(raters[userUID]);
    }

    setSelectedArticle(article);
    setIsModalVisible(true);
  };

  const handleLikeOrDislike = async (isLike) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userUID = userData.uid;

    const docRef = doc(db, 'articles', selectedArticle.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const articleData = docSnap.data();
      const raters = articleData.raters || {};
      const currentStatus = raters[userUID];

      if (currentStatus !== isLike) {
        raters[userUID] = isLike ? 1 : 0;

        if (currentStatus === undefined) {
          if (isLike) {
            selectedArticle.likes += 1;
          } else {
            selectedArticle.dislikes += 1;
          }
        } else if (currentStatus === 1) {
          selectedArticle.likes -= 1;
          selectedArticle.dislikes += 1;
        } else {
          selectedArticle.dislikes -= 1;
          selectedArticle.likes += 1;
        }

        await updateDoc(docRef, { raters });
        setLikeStatus(isLike ? 1 : 0);
      } else {
        delete raters[userUID];

        if (currentStatus === 1) {
          selectedArticle.likes -= 1;
        } else {
          selectedArticle.dislikes -= 1;
        }

        await updateDoc(docRef, { raters });
        setLikeStatus(null);
      }
    }
  };

  return (
    <AuthRedirect>
    <div className='pd-y' style={{ backgroundColor: '#6666664f' }}>
      <h2 className="article-big-title">Doctor → Articles</h2>
      <div className="articles">
        <div className="container">
          <div className="articles-content">
            {articles.map((article, index) => (
              <div key={index} className={`article ${index % 3 === 1 ? 'mg-x' : ''}`}>
                <h4 className="article-title">{article.title}</h4>
                <span className="article-date">{new Date(article.date.seconds * 1000).toLocaleDateString()}</span>
                <div className="desc-father">
                  <p className="article-description">{article.shortDesc}</p>
                </div>
                <button className='read-article' onClick={() => handleReadClick(article)}>Read</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <h2>{selectedArticle.title}</h2>
            <p><strong>Date:</strong> {new Date(selectedArticle.date.seconds * 1000).toLocaleDateString()}</p>
            <p>{selectedArticle.shortDesc}</p>
            <p><b>Article:</b> {selectedArticle.article}</p>
            <div className="like-or-dislike">
              <label htmlFor="like" style={{ display: 'inline-block' }}>Likes :</label>
              <i
                className='bx bxs-like'
                style={{ display: 'inline-block', color: likeStatus === 1 ? 'green' : 'black' }}
                id="like"
                onClick={() => handleLikeOrDislike(true)}
              ></i>
              <label className="like-count" style={{ display: 'inline-block', marginLeft: '40px' }}>
                {Object.values(selectedArticle.raters || {}).filter(value => value === 1).length}
              </label>
            </div>
            <div className="like-or-dislike">
              <label htmlFor="dislike" style={{ display: 'inline-block' }}>DisLikes :</label>
              <i
                className='bx bxs-dislike'
                style={{ display: 'inline-block', top: '4px', color: likeStatus === 0 ? 'red' : 'black' }}
                id="dislike"
                onClick={() => handleLikeOrDislike(false)}
              ></i>
              <label className="dislike-count" style={{ display: 'inline-block', marginLeft: '40px' }}>
                {Object.values(selectedArticle.raters || {}).filter(value => value === 0).length}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
    </AuthRedirect>
  );
};

export default Articles;
