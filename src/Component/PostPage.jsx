import TweetBody from './TweetBody'
import '../postPage.scss'
import firebase from '../firebase-cred/firebase'
import { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

const PostPage = (props) => {
    const [tweet, setTweet] = useState([])
    const tweetPath = window.location.pathname.slice(7)
    
    useEffect(() => {
        const tweetDB = firebase.firestore().collection("tweets")
        tweetDB.doc(tweetPath).get()
            .then(tweet => {
                const actualTweet = []
                actualTweet.push(tweet.data())
                setTweet(actualTweet)
            })
    }, [])
        if(tweet.length > 0) {
            return (
                <div className='post-page-container'>
                    <TweetBody tweets={tweet}/>
                    <Form.Control as='textarea' className='comment-input' rows={3}/>
                </div>
            )
        } else {
            return (
                <div></div>
            )
        }    
}

export default PostPage