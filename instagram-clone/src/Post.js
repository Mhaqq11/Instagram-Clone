import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@mui/material/Avatar';
import { db } from './firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, orderBy } from "firebase/firestore"; 


function Post({postId, user, username, caption, imageUrl}) {
  const [comments, setComments] = useState ([]);
  const [comment, setComment] = useState('');


    useEffect(() => {
      let unsubscribe;

      if (postId) {
         const subColRef = collection(db, "posts", postId, "comments");
           unsubscribe = onSnapshot(subColRef, orderBy('timestamp', 'desc'), (snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()))
          });

      }

      return () => {
        unsubscribe();
      }

      
    }, [postId]);

    const postComment = (event) => {
      event.preventDefault();

      addDoc(collection(db, "posts", postId, "comments"), {
        text: comment,
        username: user.displayName,
        timestamp: serverTimestamp()

      });

      setComment('');

    }

  return (
    <div className="post">
      <div className="post__header">
      <Avatar  
        className="post__avatar"
        alt="Remy Sharp"
        src="/static/images/avatar/1.jpg"
      />
      <h3>{username}</h3>
      </div>
        {/* header -> avatar + username */}
        <img
         className="post__image" src={imageUrl}
         alt=""
         />
        {/* image */}  

        <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
        {/* username + caption */}

        <div className="post__comments">
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>

        {user && ( // if user is loggin
          <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post 
          </button>
          
        </form>
        )}

        
    </div>
  )
}

export default Post