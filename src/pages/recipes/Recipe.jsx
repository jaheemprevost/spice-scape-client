import { useState } from "react";
import { Link } from "react-router-dom";

export default function Recipe(props) {
  return ( 
    <div className='recipe-tile'>
      <Link to={`/recipes/${props.recipeId}`}>  
          <div className='author-info'> 
            <img className='author-image' src={props.authorImage} />
            <p className='author-name'>{props.authorName}</p>
          </div>
          <p className='recipe-name'>{props.name}</p>
      </Link>  
    </div> 
  )
}
