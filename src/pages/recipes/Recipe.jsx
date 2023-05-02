import { useState } from "react";
import { Link } from "react-router-dom";

export default function Recipe(props) {
  return ( 
    <div className='recipe-tile'>
      <Link to={`/recipes/${props.recipeId}`}>  
        <div className='image-container'>
          <img 
            src={props.image} 
            className='recipe-thumbnail'
            alt={props.name}
          />
        </div>

        <div className="recipe-info">
          <p className="recipe-name">{props.name}</p>

          <div className="author-info">
            <img src={props.authorImage} className='author-thumbnail' alt={props.authorName}/>
            <p>{props.authorName}</p>
          </div>
        </div>
      </Link>  
    </div> 
  )
}
