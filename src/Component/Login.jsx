import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { withRouter, Redirect } from "react-router";
import firebase from "../firebase-cred/firebase";
import { AuthContext } from "../auth";
import "firebase/auth";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import {getKeywords} from './TweetsContainer'

const Login = ({ history }) => {
  const [target, setTarget] = useState(null);
 const [showWrongPassword, setShowWrongPassword] = useState(false)
 const ref = useRef(null);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        handleShowWrongPassword()
        console.error(error);
      }
    },
    [history]
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("signed in");
      } else {
        console.log("signed out");
      }
    });
  }, []);
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to='/profile-page' />;
  }

  const googleSignIn =  () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userDB = firebase.firestore().collection('users')

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(async (result) => {
        const newUser = {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.displayName,
          photoUrl: result.user.photoURL,
          bio: '',
          followers: '',
          following: '',
          keywords: getKeywords(result.user.displayName)
      }
      await userDB.doc(result.user.uid).set(newUser);
        console.log(result.user);
      })
      .catch((error) => {
      });
  };
  const handleShowWrongPassword = (e) => {
       setShowWrongPassword(true)
       setTimeout(()=>{
        setShowWrongPassword(false)
      },2000)
  }
  return (
    <div className='profile-container'>
      <h1 className='log-title'> LOGIN </h1>
      <form onSubmit={handleLogin} className='form-container'>
        <Form.Control
          name='email'
          type='email'
          placeholder='Email'
          className='log-input'
        />

        <Form.Control
          name='password'
          type='password'
          placeholder='Password'
          className='log-input'
        />
        <Button type='submit' className='save-username' onClick={(e)=>{
          setTarget(e.target)
        }}>
          Login
        </Button>
        <Link id='sign-up' to='/signup'>
          {" "}
          Doesn't have an account ? Sign up now !{" "}
        </Link>
        <div id='sign-up'> Or sign in with Google. </div>
        <Button className='btn btn-light btn-google' onClick={googleSignIn}>
          <img src='https://img.icons8.com/fluent/30/000000/google-logo.png' alt="Google SignIn"/>
        </Button>
      </form>
      <Overlay
          show={showWrongPassword}
          target={target}
          placement='bottom'
          container={ref.current}
          containerPadding={30}
        >
          <Popover id='popover-contained'>
            <Popover.Title as='h3'>Sorry !</Popover.Title>
            <Popover.Content>You entered a wrong password, please try again.</Popover.Content>
          </Popover>
        </Overlay>
    </div>
  );
};

export default withRouter(Login);
