import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='error-page'>
      <h2>Error 404</h2>

      <p>What you're looking for doesn't seem to exist. Please return home</p>

      <Link className='return-btn' to='/'>Return Home</Link>
    </div>
  )
}
