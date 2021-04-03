import "../navbar.scss";
import { Link } from 'react-router-dom'
import firebase from '../firebase-cred/firebase'
import 'firebase/auth'
import {AuthContext} from '../auth'
import { useContext, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Navbar = (props) => {
  const [smShow, setSmShow] = useState(false);

  const {currentUser} = useContext(AuthContext)

  const handleLogout = () => {
  }

  const logout = () => {
    setSmShow(false)
    firebase.auth().signOut()
  }
  return (
    <nav className="my-nav">
        <div className='logo'> Twitwi </div>
      <div className='nav-links'> 
      <ul >
        <li>
        <Link to="/"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1.5 24 24" width="32" height="32" preserveAspectRatio="xMinYMin" className="icon__icon"><path d="M13 20.565v-5a3 3 0 0 0-6 0v5H2a2 2 0 0 1-2-2V7.697a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.697v10.868a2 2 0 0 1-2 2h-5z"></path></svg> </Link>
        </li>
        {currentUser && <li>
        <Link to={`profile/${currentUser.uid}`}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="32" height="32" preserveAspectRatio="xMinYMin" className="icon__icon"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-14a4 4 0 0 1 4 4v2a4 4 0 1 1-8 0V8a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0V8a2 2 0 0 0-2-2zM5.91 16.876a8.033 8.033 0 0 1-1.58-1.232 5.57 5.57 0 0 1 2.204-1.574 1 1 0 1 1 .733 1.86c-.532.21-.993.538-1.358.946zm8.144.022a3.652 3.652 0 0 0-1.41-.964 1 1 0 1 1 .712-1.868 5.65 5.65 0 0 1 2.284 1.607 8.032 8.032 0 0 1-1.586 1.225z"></path></svg> </Link>
        </li>}
        {currentUser && <li>
        <Link to="/search"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2.5 -2.5 24 24" width="32" height="32" preserveAspectRatio="xMinYMin" className="icon__icon"><path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z"></path></svg> </Link>
        </li>}
        {currentUser && <li>
        <Link to="/settings"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="32" height="32" preserveAspectRatio="xMinYMin" className="icon__icon"><path d="M20 8.163A2.106 2.106 0 0 0 18.926 10c0 .789.433 1.476 1.074 1.837l-.717 2.406a2.105 2.105 0 0 0-2.218 3.058l-2.062 1.602A2.104 2.104 0 0 0 11.633 20l-3.29-.008a2.104 2.104 0 0 0-3.362-1.094l-2.06-1.615A2.105 2.105 0 0 0 .715 14.24L0 11.825A2.106 2.106 0 0 0 1.051 10C1.051 9.22.63 8.54 0 8.175L.715 5.76a2.105 2.105 0 0 0 2.207-3.043L4.98 1.102A2.104 2.104 0 0 0 8.342.008L11.634 0a2.104 2.104 0 0 0 3.37 1.097L17.064 2.7a2.105 2.105 0 0 0 2.218 3.058L20 8.162zM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg></Link>
        </li>}
        {currentUser && <li>
        <Link to="/"><svg onClick={() => setSmShow(true)} xmlns="http://www.w3.org/2000/svg" viewBox="-6 -2 24 24" width="32" height="32" preserveAspectRatio="xMinYMin" className="icon__icon"><path d="M2 0h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v16h8V2H2zm2 7h1a1 1 0 1 1 0 2H4a1 1 0 0 1 0-2z"></path></svg></Link>
        </li>}
      </ul>
      </div>
      <Modal
          size='sm'
          show={smShow}
          onHide={() => setSmShow(false)}
          aria-labelledby='example-modal-sizes-title-sm'
        >
          <Modal.Body>
            <div className='modalContainer'>
            Logout ?
              <div className='logout-buttons'>
                <Button onClick={() => logout()}>
                  Logout
                </Button>{" "}
                <Button onClick={() => setSmShow(false)}>Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </nav>
  );
};

export default Navbar;
