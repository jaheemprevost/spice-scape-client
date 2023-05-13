import { NavLink, Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <> 
      <div className='tabs'>
        <div className="tab">
          <NavLink to='/' end={true}>Recipes</NavLink>
        </div>

        <div className="tab">
          <NavLink to='/following'>Following</NavLink>  
        </div>
      </div>

      <Outlet />
    </>
  )
}
