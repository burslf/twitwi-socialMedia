import { useState, useContext } from "react";
import { AuthContext } from "../auth";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import moment from "moment";

const TweetBody = (props) => {
  const [smShow, setSmShow] = useState(false);
  const [currentDocID, setDocID] = useState("");
  
  const { currentUser } = useContext(AuthContext);

  const handleDeleteTweet = (id) => {
    props.deleteTweet(id);
    setSmShow(false);
  };

  const handleAddLike = (uid, docID, oldArray) => {
    props.addLike(uid, docID, oldArray);
  };
  const handleRemoveLike = (uid, docID, oldArray) => {
    props.removeLike(uid, docID, oldArray);
  };

  const pathToProfile = (username) => {
    return `/profile/${username}`;
  };

  // const pathToTweet = (id) => {
  //   return `/tweet/${id}`
  // }

  const singleTweet = props.tweets.map((tweet, index) => {
    const theDate = moment(tweet.date).fromNow();
    const TweetHeader = () => {
      return (
        <div className='tweet-title'>
          <div className='tweet-profile-info'>
            <Link to={pathToProfile(tweet.uid)}>
              <img
                src={tweet.photoUrl}
                alt=''
                className='profile-miniature'
                width='32'
                height='32'
              />
            </Link>

            <Link to={pathToProfile(tweet.uid)} className='tweet-username'>
              ~{tweet.username}
            </Link>
          </div>
          {tweet.uid === currentUser.uid && props.currentPage === 'homePage' && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='-3 -2 24 24'
              width='24'
              height='24'
              preserveAspectRatio='xMinYMin'
              onClick={() => {
                setDocID(tweet.docID);
                setSmShow(true);
              }}
              className='icon__icon delete-tweet-button'
            >
              <path d='M12 2h5a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h5V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1zm3.8 6l-.613 9.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.205 8H15.8zM7 9a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1zm4 0a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1z'></path>
            </svg>
          )}
        </div>
      );
    };
    const TweetFooter = () => {
      return (
        <div className='tweet-bottom'>
          <div className='like-buttons'>
            {!tweet.likes.includes(currentUser.uid) && (
              <svg
                onClick={() => {
                  setDocID(tweet.docID);
                  handleAddLike(currentUser.uid, tweet.docID, tweet.likes);
                }}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='-2 -4 24 24'
                width='28'
                height='30'
                preserveAspectRatio='xMinYMin'
                className='icon__icon like-button'
              >
                <path d='M3.636 7.208L10 13.572l6.364-6.364a3 3 0 1 0-4.243-4.243L10 5.086l-2.121-2.12a3 3 0 0 0-4.243 4.242zM9.293 1.55l.707.707.707-.707a5 5 0 1 1 7.071 7.071l-7.07 7.071a1 1 0 0 1-1.415 0l-7.071-7.07a5 5 0 1 1 7.07-7.071z'></path>
              </svg>
            )}
            {tweet.likes.includes(currentUser.uid) && (
              <svg
                onClick={() => {
                  setDocID(tweet.docID);
                  handleRemoveLike(currentUser.uid, tweet.docID, tweet.likes);
                }}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='-2 -4 24 24'
                width='28'
                height='30'
                preserveAspectRatio='xMinYMin'
                className='icon__icon unlike-button'
              >
                <path d='M9.293 1.55l.707.708.707-.707a5 5 0 1 1 7.071 7.071l-7.07 7.071a1 1 0 0 1-1.415 0L2.222 8.622a5 5 0 1 1 7.07-7.071z'></path>
              </svg>
            )}
            <span className='like-counter'>
              {tweet.likes.length}
            </span>
            {/* <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='-2 -2 24 24'
              width='25'
              height='27'
              preserveAspectRatio='xMinYMin'
              className='icon__icon comments-button'
            >
              <path d='M3 .565h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-6.958l-6.444 4.808A1 1 0 0 1 2 18.57v-4.006a2 2 0 0 1-2-2v-9a3 3 0 0 1 3-3z'></path>
            </svg>
            <span className='comments-counter'>
              {tweet.comments.length} 
            </span> */}
          </div>
          {/* <Link to={pathToTweet(tweet.docID)}> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" className="icon__icon reply-button"><path d="M13.828 7.172a.997.997 0 0 0-1-1h-6a1 1 0 1 0 0 2h3.586l-3.95 3.95a1 1 0 0 0 1.415 1.414l3.95-3.95v3.586a1 1 0 0 0 2 0v-6zM4 0h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"></path></svg>
          </Link> */}
            <span className='tweet-date'>{theDate}</span>
        </div>
      );
    };
    const DeleteModal = () => {
      return (
        <Modal
          size='sm'
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby='example-modal-sizes-title-sm'
        >
          <Modal.Header closeButton>
            <Modal.Title id='example-modal-sizes-title-sm'>
              Are you sure ?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='modalContainer'>
              If you delete your tweet, it won't be recoverable !
              <div className='modal-buttons'>
                <Button onClick={() => handleDeleteTweet(currentDocID)}>
                  Yes
                </Button>{" "}
                <Button onClick={() => setSmShow(false)}>No</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );
    };

    return (
        <div className='tweet-body' key={index} id={index}>
          {TweetHeader()}
          <div className='tweet-content'> {tweet.content} </div>
          {TweetFooter()}
          {DeleteModal()}
        </div>
    );
  });
  return singleTweet;
};

export default TweetBody;
