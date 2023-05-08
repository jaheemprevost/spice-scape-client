import { Link } from 'react-router-dom';

export default function SomethingWrong() {
  return (
    <div className='error-page'>
      <h2>Error 500</h2>

      <p>Something went wrong. Please return home and try again.</p>

      <Link className='return-btn' to='/'>Return Home</Link>
    </div>
  )
}
