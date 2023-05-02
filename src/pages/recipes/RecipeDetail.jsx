import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  return (
    <p>{recipeId}</p>
  )
}
