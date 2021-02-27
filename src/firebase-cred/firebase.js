import firebase from 'firebase/app'
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCyNs0RF8NA2vL0sqabPz0PF_QnfIEZQSM",
    authDomain: "twitwi-841ea.firebaseapp.com",
    projectId: "twitwi-841ea",
    storageBucket: "twitwi-841ea.appspot.com",
    messagingSenderId: "993624950100",
    appId: "1:993624950100:web:4b9426cb9ba8ccf72e34c1"
  };

firebase.initializeApp(firebaseConfig)

export default firebase