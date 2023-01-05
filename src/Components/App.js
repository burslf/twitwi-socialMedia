import "../index.scss";
import TweetsContainer from "./tweet-container/TweetsContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Settings from "./settings/Settings";
import { useState, useContext, useEffect } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { AuthContext } from "../auth";
import firebase from "../firebase-cred/firebase";
import Search from "./search/Search";
import UserProfile from "./user-profile/UserProfile";
import Spinner from "react-bootstrap/Spinner";
import { getKeywords } from "./tweet-container/TweetsContainer";
import PostPage from "./post-page/PostPage";

function App() {
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(true);

  const { currentUser } = useContext(AuthContext);

  const userNameRef = firebase.auth().currentUser;
  const tweetsRef = firebase.firestore().collection("tweets");
  const userDB = firebase.firestore().collection("users");

  const changeUsername = async (username) => {
    const usersBatch = userDB.firestore.batch();
    const userRef = userDB.doc(currentUser.uid);
    await userNameRef.updateProfile({
      displayName: username,
    });
    setUsername(username);
    usersBatch.update(userRef, { username: username });
    usersBatch.update(userRef, { keywords: getKeywords(username) });
    usersBatch.commit();
    await tweetsRef
      .where("uid", "==", currentUser.uid)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot) {
          const tweetBatch = tweetsRef.firestore.batch();
          querySnapshot.docs.forEach((doc) => {
            tweetBatch.update(doc.ref, { username: username });
          });
          tweetBatch.commit();
        }
      });
  };

  const changeBio = async (bio) => {
    await userDB
      .doc(currentUser.uid)
      .get()
      .then((query) => {
        const userBatch = userDB.firestore.batch();
        userBatch.update(query.ref, { bio: bio });
        userBatch.commit();
      });
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const name = {};
    if (user != null) {
      setLoading(false);
      name.username = user.displayName;
      setUsername(name.username);
    }
  }, [currentUser]);

  return (
    <Router>
      <div className='mycontainer'>
        <Nav />
        {isLoading && <Spinner animation='grow' variant='light' />}
        <Routes>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path={`/profile/:id`}element={<UserProfile/>}/>
          <Route path={`/tweet/:id`}element={<PostPage/>}/>
          <Route path='/settings'element={<Settings changeUsername={changeUsername} changeBio={changeBio}/>}/>
          <Route path='/' element={currentUser ? <TweetsContainer username={username}/> : <Login/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
