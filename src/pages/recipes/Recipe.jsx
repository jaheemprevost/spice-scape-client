import { useState } from "react";
import { Link } from "react-router-dom";

export default function Recipe(props) {
  return ( 
    <div className='recipe-tile'>
      <Link to={`/recipes/${props.recipeId}`}>  
          <p className="recipe-name">{props.name}</p>
      </Link>  
    </div> 
  )
}
