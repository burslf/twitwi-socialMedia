import "../settings.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { useRef, useState, useEffect, useContext } from "react";
import firebase from "../firebase-cred/firebase";
import "firebase/storage";
import { AuthContext } from "../auth";

const Settings = (props) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState('********')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showDoesntMatch, setDoesntMatch] = useState(false)
  const [isUserEditable, setUserEditable] = useState(true);
  const [isBioEditable, setBioEditable] = useState(true);
  const [isPasswordEditable, setPasswordEditable] = useState(true)
  const [showErrorPassword, setShowErrorPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const getUserName = () => {
    const user = firebase.auth().currentUser;
    const name = {};
    if (user != null) {
      name.username = user.displayName;
      setUsername(getUserInfo().name);
    }
  };
  const getBio = () => {
    const user = firebase.auth().currentUser
    const userDB = firebase.firestore().collection('users')
    if(user != null) {
      let bio = ""
      userDB.doc(user.uid).get().then(user => {
        bio = user.data().bio
        setBio(bio)
      })
    }
  }
  const getUserInfo = () => {
    const user = firebase.auth().currentUser;
    const userInfos = {};

    if (user != null) {
      userInfos.name = user.displayName;
      userInfos.email = user.email;
      userInfos.photoUrl = user.photoURL;
      userInfos.emailVerified = user.emailVerified;
      userInfos.uid = user.uid;
    }
    return userInfos;
  };

  useEffect(() => {
    getUserName();
    getUserInfo();
    getBio();
  }, [currentUser]);

  const handleSaveUsername = (e) => {
    e.preventDefault()
    if (username.length === 0) {
      setShowEmpty(!showEmpty);
      setTarget(e.target);
    } else {
      setTarget(e.target);
      setShowSuccess(!showSuccess);
      setTimeout(() => {
        setBioEditable(!isBioEditable)
        setUserEditable(!isUserEditable);
        setShowSuccess(showSuccess);
      }, 1000);
      props.changeUsername(username);
      props.changeBio(bio);
    }
  };


const handleSavePassword = (e) => {
  e.preventDefault()
  if (confirmPassword.length === 0) {
    console.log('pute')
    setTarget(e.target);
    setShowEmpty(!showEmpty);
  } else {
    if(password === confirmPassword) {
      const newPassword = password
      currentUser.updatePassword(newPassword).then(() => {
        setShowSuccess(!showSuccess);
        setTimeout(() => {
          setShowSuccess(showSuccess);
          setPasswordEditable(!isPasswordEditable);
        }, 1000);
      }).catch(error => {
        setShowErrorPassword(true)
      });
    } else {
      setTarget(e.target);
      setDoesntMatch(!showDoesntMatch)
    }
  }
};

const handleEditPassword = (e) => {
  e.preventDefault()
  setPassword()
  setConfirmPassword()
  setPasswordEditable(!isPasswordEditable)
}

const handlePasswordChange = (e) => {
  e.preventDefault()
  setPassword(e.target.value);
}

const handleConfirmPasswordChange = (e) => {
  e.preventDefault()
  setConfirmPassword(e.target.value)
}
  const handleUsernameChange = (e) => {
    e.preventDefault()
    setUsername(e.target.value);
  };

  const handleBioChange = (e) => {
    e.preventDefault()
    setBio(e.target.value);
  };

  const handleEditUsername = () => {
    setUserEditable(!isUserEditable);
  };
  const handleEditBio = () => {
    setBioEditable(!isBioEditable);
  };

  const handleImageUpload = () => {
    document.querySelector("#custom-file").click();
  };

  const uploadImage = async (e) => {
    const image = e.target.files[0];
    const storage = firebase.storage();
    const storageRef = storage.ref(`profilePic/${getUserInfo().uid}.jpg`);
    const userDB = firebase.firestore().collection('users')
    const tweetsRef = firebase.firestore().collection("tweets");
    await storageRef.put(image);
    console.log("uploaded");
    const photoURL = await storageRef.getDownloadURL();
    await currentUser.updateProfile({
      photoURL: photoURL,
    });
    await userDB.doc(currentUser.uid).get().then(user => {
      if (user) {
        const usersBatch = userDB.firestore.batch();
      if(user.data().photoUrl !== photoURL) {
        usersBatch.update(user.ref,{"photoUrl":photoURL})
        usersBatch.commit();
      }
    }
    })
    await tweetsRef.where('uid', '==', currentUser.uid).get().then((querySnapshot) => {
      if(querySnapshot){
        const tweetBatch = tweetsRef.firestore.batch();
        querySnapshot.docs.forEach((doc) => {
          if(doc.data().photoUrl !== photoURL) {
            tweetBatch.update(doc.ref,{"photoUrl":photoURL})
            tweetBatch.commit();
          }
        });
      }
    });
    setProfilePic(photoURL);
  };

  const adaptTextArea = () => {
    if(!isBioEditable) {
      return 9
    } else {
      return 4
    }
  }
  return (
    <div className='profile-container'>
      <div className='image-profile-container'>
        <div className='setting-image-container'>
        <img
          src={getUserInfo().photoUrl}
          className='profile-image'
          alt=''
          width='96'
          height='96'
        />
        </div>
        <Button
          className='edit-profile-image-button'
          onClick={handleImageUpload}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='-2 -4 24 24'
            width='24'
            height='24'
            preserveAspectRatio='xMinYMin'
            className='icon__icon'
          >
            <path d='M4.126 3C4.57 1.275 6.136 0 8 0h4a4.002 4.002 0 0 1 3.874 3H16a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h.126zM10 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-6 3a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'></path>
          </svg>
        </Button>
      </div>
      {isBioEditable && <Button type='submit' className='edit-button btn btn-light' onClick={() => {
          handleEditBio()
          handleEditUsername()
          }}>
          Tap to edit
        </Button>}
      <h3 className='profile-title'> Username </h3>
      <Form className='form-container'>
        <Form.File
          className='edit-profile-image'
          id='custom-file'
          label='Custom file input'
          custom
          onChange={uploadImage}
        />
          <Form.Control
            type='text'
            className='username-input'
            onChange={handleUsernameChange}
            value={username}
            disabled={isUserEditable}
          />

        <h3 className='profile-title'>Bio</h3>
        <Form.Control
          as='textarea'
          rows={adaptTextArea()}
          className='bio-input'
          value={bio}
          onChange={handleBioChange}
          disabled={isBioEditable}
        />

        {!isBioEditable && <Button
              type='submit'
              className='save-button btn btn-light'
              onClick={handleSaveUsername}
            >
              Save
            </Button>}
            <h3 className='profile-title'>Email</h3>
        <Form.Control
          type='text'
          className='email-input'
          value={getUserInfo().email}
          disabled={true}
        />
        <h3 className='profile-title'>Password</h3>
        <Form.Control
          type='password'
          className='password-input'
          value={password}
          disabled={isPasswordEditable}
          onChange={handlePasswordChange}
          placeholder="New password"
        />
        
        {!isPasswordEditable &&         <Form.Control
          type='password'
          className='password-input'
          value={confirmPassword}
          disabled={isPasswordEditable}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm new password"
        />}
        {showErrorPassword && <span>Error: try to sign out and login again </span>}
        {isPasswordEditable && <Button type='submit' className='edit-password-button btn btn-light' onClick={handleEditPassword}>
          Edit password
        </Button>}
        {!isPasswordEditable && <Button
              type='submit'
              className='save-button btn btn-light'
              onClick={handleSavePassword}
            >
              Save
            </Button>}
        <Overlay
          show={showSuccess}
          target={target}
          placement='bottom'
          container={ref.current}
          containerPadding={30}
        >
          <Popover id='popover-contained'>
            <Popover.Title as='h3'>Saved !</Popover.Title>
          </Popover>
        </Overlay>

        <Overlay
          show={showEmpty}
          target={target}
          placement='bottom'
          container={ref.current}
          containerPadding={30}
        >
          <Popover id='popover-contained'>
            <Popover.Title as='h3'>Sorry, {username} !</Popover.Title>
            <Popover.Content>The field can't be empty.</Popover.Content>
          </Popover>
        </Overlay>

        <Overlay
          show={showDoesntMatch}
          target={target}
          placement='bottom'
          container={ref.current}
          containerPadding={30}
        >
          <Popover id='popover-contained'>
            <Popover.Title as='h3'>Sorry, {username} !</Popover.Title>
            <Popover.Content>The passwords do not match.</Popover.Content>
          </Popover>
        </Overlay>
      </Form>
    </div>
  );
};

export default Settings;
