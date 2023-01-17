import { Button } from '@mui/material'
import React, {useState} from 'react'
import { db, storage } from './firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import './ImageUpload.css'; 



function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
            // progress function
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgresspercent(progress);
            },
            (error) => {
                //error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    addDoc(collection(db,'posts'),{
                        timestamp: serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                });

                setProgresspercent(0);
                setCaption("");
                setImage(null);
            }

        );
        
    };

    
  return (
    <div className="imageupload">

      <progress className="imageupload__progress" value={progresspercent} max="100"/>
      <input type="text" placeholder='Enter a caption' onChange={event => setCaption(event.target.value) } value={caption} />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>
        Upload
      </Button>


    </div>
  )
}

export default ImageUpload