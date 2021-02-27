import { useCallback } from 'react';
import {withRouter} from 'react-router'
import firebase from '../firebase-cred/firebase'
import 'firebase/auth'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";

const SignUp = ( {history} ) => {
    const handleSignUp = useCallback(async event => {
        const userDB = firebase.firestore().collection('users')
        event.preventDefault()
        const { email, password } = event.target.elements
        try {
            await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then(async data => {
                const newUser = {
                    uid: data.user.uid,
                    email: data.user.email,
                    username: data.user.displayName,
                    photoUrl: data.user.photoURL,
                    bio: '',
                    followers: '',
                    following: '',
                    keywords: []
                }
                await userDB.doc(data.user.uid).set(newUser);
            })
            history.push("/")
        } catch (error) {
            console.error(error)
        }
    }, [history])

    return (
        <div className="profile-container">
            <h1 className='log-title'> SIGN UP </h1>
            <form onSubmit={handleSignUp}
                    className='form-container' 
            >

                <Form.Control className='log-input' name="email" type="email" placeholder="Email"/>

                <Form.Control className='log-input' name="password" type="password" placeholder="Password"/>
                <Button type="submit" className='save-username'> Sign up </Button>
            </form>
        </div>
    )

}

export default withRouter(SignUp)