import { useState } from "react";
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'

const TweetForm = (props) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.postTweet(input);
    setInput("");
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const disableTweet = () => {
    if(input.length < 1) {
      return true
    } else if (!props.username) {
      return true
    } else if (input.length >= 140) {
      return true
    } else {
      return false
    }
  }

  return (
      <>
    <form className="tweet-form" onSubmit={handleSubmit}>
      <textarea value={input} onChange={handleChange} rows={6} maxLength={140} placeholder="Click and write down your thoughts..."></textarea>
      {!props.username && <span className="max-chars" >You need to set a username before posting ! <Link to="/settings">Go set </Link></span>}
      {input.length >= 140 && <span className="max-chars" >The tweet can't contain more then 140 chars.</span>}
      {!disableTweet() && <Button type='submit' className="btn btn-light tweet-button" disabled={disableTweet()}>Send</Button>}
    </form>
        </>
  );
};

export default TweetForm;
