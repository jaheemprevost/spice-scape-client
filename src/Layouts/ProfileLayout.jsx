import { Link, Outlet} from 'react-router-dom'; 
import Profile from '../pages/profile/Profile';

export default function ProfileLayout() {
  return (
    <>
      <Profile />
      <Outlet />
    </>
  )
}
