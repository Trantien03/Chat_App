import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword,signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";  // Import doc
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyAxCoTEYMLOdmSPZPOwUo_v5LLU48MGoKA",
  authDomain: "chat-dd85a.firebaseapp.com",
  projectId: "chat-dd85a",
  storageBucket: "chat-dd85a.appspot.com",
  messagingSenderId: "526963782647",
  appId: "1:526963782647:web:4be6d79954ccfac881f4f2",
  measurementId: "G-305LCQBTGC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, There I am using chat app",
      lastSeen: Date.now()  // Fixed typo
    });
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: []
    });
    toast.success("User created successfully!");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(""));  // Improved error message
  }
};

const login = async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
        toast.success("User logged in successfully!");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join("")); 
    }
}

const logout = async () =>{
    try {
        await signOut(auth)
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join("")); 
    }
    
}
const resetPass = async (email) =>{
  if (!email) {
    toast.error("Enter your email!");
    return;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","--",email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent")
    }else{
      toast.error("Email doesn't exists!")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export { signup,login,logout, auth,db,resetPass };
