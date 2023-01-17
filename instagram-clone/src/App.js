import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, orderBy} from "firebase/firestore";
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Button, Input } from '@mui/material';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { signOut, signInWithEmailAndPassword } from "firebase/auth";
import ImageUpload from './ImageUpload';
import { InstagramEmbed } from 'react-social-media-embed';




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null)

  // listener for anytime authentication change happens
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => { 
      if (authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else {
      // user has logged out
      setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }

    
  }, [user,username]);


  // useEffect -> Runs a piece of code based on a specific condition
  
  useEffect(() => 
   // this where the code runs
    onSnapshot(collection(db,'posts'), orderBy('timestamp','desc'), (snapshot) => {
      // every time a new post is added, this code fires
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
      // posts the properites of the data
    }),
   []
  );

  const signUp = (event) => {
    event.preventDefault(); //this won't cause a refresh when submitting

    createUserWithEmailAndPassword(auth, email, password)
    .then((authUser) => {
     return updateProfile(authUser.user, {
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);

  }

  const signIn = (event) => {
    event.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);

  }


  return (
    <div className="App">
      

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        
      >
       <Box sx={style}>
       <form className="app__signup">
        <center>
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
          alt=""
        />
       </center>
       <Input
          placeholder='username'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder='email'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={signUp}>Sign Up</Button>
        </form>
       
       </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        
      >
       <Box sx={style}>
       <form className="app__signup">
        <center>
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
          alt=""
        />
       </center>
        <Input
          placeholder='email'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={signIn}>Sign in</Button>
        </form>
       
       </Box>
      </Modal>

    <div className="app__header">

      <img
        className="app__headerImage"
        src="https://www.instagram.com/static/images/web/logged_out_wordmark.png/7a252de00b20.png"
        alt=""
      />
      {user ? (  //<- if user is logged in
      <Button onClick={() => signOut(auth)}>Log out</Button>
    ): (
      <div className='app__loginContainer'> 
      <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
      <Button onClick={() => setOpen(true)}>Sign Up</Button>
      
      </div>
    )}
    </div>

    <div className="app__posts">
      <div className="app__postsLeft">
      {
      posts.map(({id, post}) => (
        <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>

      ))
      }
      </div>

      <div className="app__postsRight">
      <InstagramEmbed
        captioned
        url="https://www.instagram.com/p/CUbHfhpswxt/"
        width={328}
      />
      </div>

    </div>

    




    {user?.displayName ? ( //1st ? == only apply condition if the condition is true
        <ImageUpload username={user.displayName} />

      ): (
        <h3> Please Sign in to upload</h3>
      )}

    
     {/* Post */}
     {/* Post */}
    </div>
    

  );
}

export default App;
