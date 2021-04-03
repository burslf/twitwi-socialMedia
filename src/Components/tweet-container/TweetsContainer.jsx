import { useContext, useEffect, useRef, useState } from "react";
import './tweetsContainer.scss'
import TweetForm from "../TweetForm";
import TweetBody from "../tweet-body/TweetBody";
import firebase from "../../firebase-cred/firebase";
import shortid from "shortid";
import { AuthContext } from "../../auth";
import { Button } from "react-bootstrap";
import moment from "moment";

export const getKeywords = (str) => {
  var i,
    j,
    result = [];
  for (i = 0; i < str.length; i++) {
    for (j = i + 1; j < str.length + 1; j++) {
      result.push(str.slice(i, j).toLowerCase());
    }
  }
  return result;
};

const TweetsContainer = (props) => {
  const [tweets, setTweets] = useState([]);
  const [tweetsToShow, setTweetsToShow] = useState([])
  const [totalTweet, setTotalTweet] = useState(null);
  const [showTweets, setShowTweets] = useState(true);

  const ref = firebase.firestore().collection("tweets");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      getTweets();
    }
  }, []);


  const getDate = () => {
    const d = new Date();
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0].replace(/:/g, "-");
    return `${date} ${time}`;
  };
  const getOtherWayDate = () => {
    const mydate = new Date().toUTCString();
    return mydate;
  };
  const getTweets = () => {
    ref.onSnapshot((querySnapshot) => {
      const tweets = [];
      querySnapshot.forEach((tweet) => tweets.push(tweet.data()));
      setTweets(tweets.sort((a, b) => b.id - a.id));
    });
  };

  const postTweet = async (input) => {
    const numberDate = moment().utc().format("YYYY-MM-DD HH:mm:ss").replace(/\-/g, '').replace(/\:/g, '').split(' ').join('')
    const docId = shortid.generate();
    const newTweet = {
      id: numberDate,
      uid: currentUser.uid,
      content: input,
      username: currentUser.displayName,
      date: getOtherWayDate(),
      photoUrl: currentUser.photoURL,
      docID: docId,
      likes: [],
      keywords: getKeywords(input),
      comments: [],
    };
    await ref.doc(docId).set(newTweet);
    setTotalTweet(totalTweet + 1);
  };

  const setFilterButtonText = () => {
    if (showTweets) {
      return "All tweets";
    } else {
      return "My tweets";
    }
  };

  const handleShowTweets = () => {
    setShowTweets(!showTweets);
  };

  const showTheTweets = () => {
    if (showTweets) {
      return tweets;
    } else {
      return tweets.filter((a) => a.uid === currentUser.uid);
    }
  };
  const deleteTweet = async (id) => {
    await ref.doc(id).delete();
  };

  const addLike = async (uid, docID, likes) => {
    if (!likes.includes(uid)) {
      const updateLikes = [uid, ...likes];
      const tweetsRef = firebase.firestore().collection("tweets");
      const batch = tweetsRef.firestore.batch();
      const currentTweet = tweetsRef.doc(docID);
      batch.update(currentTweet, { likes: updateLikes });
      await batch.commit();
    }
  };
  const removeLike = async (uid, docID, likes) => {
    if (likes.includes(uid)) {
      const updateLikes = likes.filter((a) => a !== uid);
      console.log(updateLikes);
      const tweetsRef = firebase.firestore().collection("tweets");
      const batch = tweetsRef.firestore.batch();
      const currentTweet = tweetsRef.doc(docID);
      batch.update(currentTweet, { likes: updateLikes });
      await batch.commit();
    }
  };

  return (
    <div className='tweet-container'>
      <TweetForm postTweet={postTweet} username={props.username} />
      <div className='all-tweets-area'>
        <Button
          className='btn btn-light filter-tweets'
          onClick={handleShowTweets}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='-6 -2 24 24'
            width='22'
            height='24'
            preserveAspectRatio='xMinYMin'
            className='icon__icon filter-icon'
          >
            <path d='M2 17h8v-2H2v2zm.535-4h6.93A3.998 3.998 0 0 0 6 11c-1.48 0-2.773.804-3.465 2zM10 5V3H2v2h8zm-.535 2h-6.93A3.998 3.998 0 0 0 6 9c1.48 0 2.773-.804 3.465-2zm-.147 3A5.994 5.994 0 0 1 12 15v4a1 1 0 0 1-2 0H2a1 1 0 0 1-2 0v-4a5.994 5.994 0 0 1 2.682-5A5.994 5.994 0 0 1 0 5V1a1 1 0 1 1 2 0h8a1 1 0 0 1 2 0v4a5.994 5.994 0 0 1-2.682 5z'></path>
          </svg>
          {setFilterButtonText()}
        </Button>
        <TweetBody
          tweets={showTheTweets()}
          deleteTweet={deleteTweet}
          addLike={addLike}
          removeLike={removeLike}
          currentPage='homePage'
        />
      </div>
    </div>
  );
};

export default TweetsContainer;
