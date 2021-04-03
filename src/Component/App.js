import "../index.scss";
import TweetsContainer from "./TweetsContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Settings from "./Settings";
import { useState, useContext, useEffect } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import { AuthContext } from "../auth";
import firebase from "../firebase-cred/firebase";
import Search from "./Search";
import UserProfile from "./UserProfile";
import Spinner from 'react-bootstrap/Spinner'
import {getKeywords} from './TweetsContainer'
import PostPage from "./PostPage";

function App() {
  const [username, setUsername] = useState("");
  const [isLoading, setLoading] = useState(true)

  const {currentUser} = useContext(AuthContext);

  const userNameRef = firebase.auth().currentUser;
  const tweetsRef = firebase.firestore().collection("tweets");
  const userDB = firebase.firestore().collection('users')

  const changeUsername = async (username) => {
    const usersBatch = userDB.firestore.batch();
    const userRef = userDB.doc(currentUser.uid)
    await userNameRef.updateProfile({
      displayName: username,
    });
    setUsername(username);
    usersBatch.update(userRef, {"username":username})
    usersBatch.update(userRef, {"keywords": getKeywords(username)})
    usersBatch.commit()
    await tweetsRef.where('uid', '==', currentUser.uid).get().then((querySnapshot) => {
      if(querySnapshot){
        const tweetBatch = tweetsRef.firestore.batch();
        querySnapshot.docs.forEach((doc) => {
          tweetBatch.update(doc.ref,{"username":username})
        });
        tweetBatch.commit();
      }
    });
  };

  const changeBio = async (bio) => {
    await userDB.doc(currentUser.uid).get().then(query => {
      const userBatch = userDB.firestore.batch()
      userBatch.update(query.ref, {"bio":bio})
      userBatch.commit()
    })
  }

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const name = {};
    if (user != null) {
      setLoading(false)
      name.username = user.displayName;
      setUsername(name.username);
    }
  }, [currentUser]);

  return (
    <Router>
      <div className='mycontainer'>
        <Nav />
        {isLoading && <Spinner animation="grow" variant="light" />}
        <Switch>
          <Route path='/signup'>
            <SignUp />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/search'>
            <Search />
          </Route>
          <Route path={`/profile/:id`}>
            <UserProfile />
          </Route>
          <Route path={`/tweet/:id`}>
            <PostPage />
          </Route>
          <Route path='/settings'>
            <Settings
              changeUsername={changeUsername}
              changeBio={changeBio}
            />
          </Route>
          <Route path='/'>
            {currentUser && <TweetsContainer username={username} />}
            {!currentUser && <Login />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
