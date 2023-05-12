import { Link } from "react-router-dom";

export default function User(props) {
  return (
    <div className='user'>
      <Link to={`/profile/${props.id}`}>
        <img className='user-image' src={props.profileImage}/>
        <p className='user-name'>{props.username}</p>
      </Link>
    </div>
  )
}
