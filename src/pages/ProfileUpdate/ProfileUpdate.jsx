import React, { useContext, useEffect, useState, useMemo } from "react";
import './ProfileUpdate.css';
import assets from "../../assets/assets";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import upload from "../../lib/upload";
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const { setUserData } = useContext(AppContext);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Please upload a profile picture.");
        return;
      }

      const docRef = doc(db, 'users', uid);
      const batch = writeBatch(db);

      if (image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        batch.update(docRef, { avatar: imgUrl });
      }

      batch.update(docRef, {
        bio: bio,
        name: name
      });

      await batch.commit();

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile updated successfully!");
      navigate('/chat');
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
          setPrevImage(data.avatar || "");
        }
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const imageUrl = useMemo(() => {
    return image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon;
  }, [image, prevImage]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleProfileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input 
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" 
              id='avatar' 
              accept='.png, .jpg, .jpeg' 
              hidden 
            />
            <img src={imageUrl} alt="Profile" />
            Upload profile image
          </label>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            type="text" 
            placeholder="Your name" 
            required 
          />
          <textarea 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            placeholder="Write profile bio" 
            required 
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img 
          className="profile-pic" 
          src={imageUrl} 
          alt="Profile Preview" 
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
