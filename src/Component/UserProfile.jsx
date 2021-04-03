import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth";
import firebase from "../firebase-cred/firebase";
import "../userprofile.scss";
import Button from "react-bootstrap/Button";
import MonModal from "./MonModal";
import Spinner from 'react-bootstrap/Spinner'
import TweetBody from './TweetBody'

const UserProfile = (props) => {
  const [userInfo, setUserInfos] = useState({});
  const [isOpen, openModal] = useState(false);
  const [currentUid, setCurrentUid] = useState("")
  const [isFollowing, changeIsFollowing] = useState(null)
  const [countFollowers, setFollowers] = useState(0)
  const [countFollowing, setFollowing] = useState(0)
  const [isLoading, setLoading] = useState(true)
  const [tweets, setTweets] = useState([])
  const { currentUser } = useContext(AuthContext);
  const tweetsDB = firebase.firestore().collection("tweets")

  const userDB = firebase.firestore().collection("users");
  const profilePath = window.location.pathname.slice(9);
  const userInfos = {};

  useEffect(() => {
    userDB
      .doc(profilePath)
      .get()
      .then((user) => {
        userInfos.username = user.data().username;
        userInfos.photoUrl = user.data().photoUrl;
        userInfos.email = user.data().email;
        userInfos.bio = user.data().bio;
        userInfos.uid = user.data().uid
        userInfos.following = user.data().following
        userInfos.followers = user.data().followers
        setUserInfos(userInfos);
        setFollowers(userInfos.followers)
        setFollowing(userInfos.following)
        setCurrentUid(user.data().uid)
        setLoading(false)
      });
      if(currentUser) {
        userDB.doc(currentUser.uid).get().then(query => {
            const following = query.data().following
            if(following.includes(profilePath)) {
                changeIsFollowing(true)
            } else {
                changeIsFollowing(false)
            }
        })
        getUserTweets()
      }
  }, [currentUser, isFollowing]);
  
  const openImage = (e) => {
    openModal(true);
  };

  const setIsModalOpen = () => {
    openModal(false);
  };
  
  const follow = async () => {  
    await userDB.doc(currentUser.uid).get().then(query => {
      const following = query.data().following
      if(!following.includes(currentUid)) {
        const userBatch = userDB.firestore.batch()
        userBatch.update(query.ref, {"following": [currentUid, ...following]})
        userBatch.commit()
      }
    })
    await userDB.doc(currentUid).get().then(query => {
        const followers = query.data().followers
        if(!followers.includes(currentUser.uid)) {
            const userBatch = userDB.firestore.batch()
            userBatch.update(query.ref, {"followers": [currentUser.uid, ...followers]})
            userBatch.commit()
        }
    })
    changeIsFollowing(true)
  }

  const unfollow = async () => {
    await userDB.doc(currentUser.uid).get().then(query => {
        const following = query.data().following
        if(following.includes(currentUid)) {
          const newFollowing = following.filter(a => a !== currentUid)
          const userBatch = userDB.firestore.batch()
          userBatch.update(query.ref, {"following": newFollowing})
          userBatch.commit()
        }
      })
      await userDB.doc(currentUid).get().then(query => {
          const followers = query.data().followers
          if(followers.includes(currentUser.uid)) {
              const newFollowers = followers.filter(a => a !== currentUser.uid)
              const userBatch = userDB.firestore.batch()
              userBatch.update(query.ref, {"followers": newFollowers})
              userBatch.commit()
          }
      })
      changeIsFollowing(false)
  }

  const getUserTweets = async () => {
    const searchResult = [];
    await tweetsDB
      .where("uid", "==", profilePath)
      .get()
      .then((data) => {
        data.forEach((tweet) => searchResult.push(tweet.data()));
      });
      const orderedResult = searchResult.sort((a,b) => b.id - a.id)
      console.log(searchResult)
      console.log(orderedResult)
      setTweets(orderedResult);
  }
  if(currentUser) {
    return (
        <div className='userprofile-container'>
            {isLoading && <Spinner animation="grow" variant="light" />}
          <div className='profile-header'>
            <div className='userprofile-main-infos'>
            <div className="photo-container">
            <img
              className='profile-pic'
              src={userInfo.photoUrl}
              alt=''
              onClick={openImage}
            />
            </div>
            <h3 className='userprofile-username'> {userInfo.username} </h3>
            </div>
            <div className='follow-container'>
            <div className='followers'>
              <span>{countFollowers.length}</span> Followers 
              </div>
              <div className='following'>
                <span>{countFollowing.length}</span>  Following 
              </div>
              {!isFollowing && currentUser.uid !== currentUid && <Button className='btn btn-light follow-button' onClick={follow}> Follow </Button>}
              {isFollowing && <Button className='btn btn-light unfollow-button' onClick={unfollow}> Unfollow </Button>}
            </div>
          </div>
          <div className='followers-following'>
             
          </div>
          <div className='userprofile-bio'><p>{userInfo.bio}</p></div>
          <TweetBody tweets={tweets} currentPage='userProfile'/>
          <MonModal
            isOpen={isOpen}
            setIsModalOpen={setIsModalOpen}
            imgSrc={userInfo.photoUrl}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      );
  } else {
      return <div></div>
  }
  
};

export default UserProfile;
