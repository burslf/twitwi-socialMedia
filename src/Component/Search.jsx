import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import firebase from "../firebase-cred/firebase";
import TweetBody from "./TweetBody";
import { Link } from "react-router-dom";
import "../search.scss";
const Search = (props) => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [showUsers, setShowUsers] = useState(true);
  const [showTweets, setShowTweets] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const tweetsDB = firebase.firestore().collection("tweets");
  const usersDB = firebase.firestore().collection("users");

  const handleChange = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const startSearch = () => {
    setTweets([]);
    const searchResult = [];
    tweetsDB
      .where("keywords", "array-contains", input.toLowerCase())
      .get()
      .then((data) => {
        data.forEach((tweet) => searchResult.push(tweet.data()));
      });
      setTweets(searchResult);
  };
  const pathToProfile = (username) => {
    return `/profile/${username}`;
  };
  const UserSearch = () => {
    setUsers([]);
    const usersResult = [];
    usersDB
      .where("keywords", "array-contains", input.toLowerCase())
      .get()
      .then((data) => {
        data.forEach((user) => {
          usersResult.push(user.data());
        });
        setUsers(usersResult);
      });
  };

  const singleUserResult = users.map((user) => {
    return (
      <div className='tweet-header'>
        <div className='tweet-title'>
          <div className='tweet-profile-info'>
            <Link to={pathToProfile(user.uid)}>
              <img
                src={user.photoUrl}
                alt=''
                className='profile-miniature'
                width='32'
                height='32'
              />
            </Link>

            <Link to={pathToProfile(user.uid)} className='tweet-username'>
              ~{user.username}
            </Link>
          </div>
        </div>
      </div>
    );
  });
  
  const showOnlyTweets = () => {
    setShowTweets(true);
    setShowUsers(false);
    setShowAll(false);
  };

  const showOnlyUsers = () => {
    setShowUsers(true);
    setShowTweets(false);
    setShowAll(false);
  };

  const showAllRequests = () => {
    setShowAll(true);
    setShowUsers(true);
    setShowTweets(true);
  };
  return (
    <div className='profile-container'>
      <div
        className='search-container'
      >
        <Form.Control
          type='text'
          className='profile-input'
          onChange={handleChange}
          value={input}
        />
        <Button
        className='btn-light search-button'
          onClick={() => {
            startSearch();
            UserSearch();
          }}
        >
          {" "}
          Search{" "}
        </Button>
      </div>
      <ButtonGroup aria-label='Basic example'>
        <Button className='filter-result-button' variant='light' onClick={showOnlyUsers}>
          Users
        </Button>
        <Button className='filter-result-button' variant='light' onClick={showOnlyTweets}>
          Tweets
        </Button>
        <Button className='filter-result-button' variant='light' onClick={showAllRequests}>
          All
        </Button>
      </ButtonGroup>
      {showAll && (users.length > 0 || tweets.length > 0) && (
        <h4 style={{ marginTop: "40px" }}> Users </h4>
      )}
      {(users.length > 0 && showUsers) &&
        <div className='user-list'>{singleUserResult} </div>
      }
      {showAll && (users.length > 0 || tweets.length > 0) && <h4> Tweets</h4>}
      {tweets.length > 0 && showTweets && (
        <div className='tweet-list'>
          <TweetBody tweets={tweets} />
        </div>
      )}
    </div>
  );
};

export default Search;
