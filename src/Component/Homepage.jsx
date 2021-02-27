import Login from './Login'

const Homepage = (props) => {
    return (
        <div className="profile-container">
        <h1> Welcome !</h1>
        <div className="homepage-content">
            <h3> I am building my first social media, made all with React ! </h3>
            <h4> Please login and enjoy the ride :)</h4>
        </div>
        <Login/>
        </div>
    )
}

export default Homepage