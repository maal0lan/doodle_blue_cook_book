import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [recipes, setCookbook] = useState([]);

  useEffect(() => {
    const fetchCookbook = async () => {
      const response = await fetch("https://dummyjson.com/recipes");
      const data = await response.json();
      setCookbook(data.recipes);
    };

    fetchCookbook();
  }, []);

  return (
    <main className="recipe-list">
      <span className="hero-head">Recipes</span>
      <div className="recipes">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img className="recipe-image" src={recipe.image}   />
            
            <div className="recipe-content">
              <span style={{fontSize:'50px'}}>{recipe.id}. {recipe.name}</span>
              <p className="recipe-details">
                {recipe.cuisine} · {recipe.difficulty} . {recipe.caloriesPerServing} calories
              </p>
              <p className="infos">
                Prep: {recipe.prepTimeMinutes} min . Cook: {recipe.cookTimeMinutes} min . Serves: {recipe.servings} . Meal type  :{recipe.mealType.join(" , ")}
              </p>

              <span className="sub-topic">Ingredients</span>
              <ul>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>

              <span className="sub-topic">Instructions</span>
              <ol>
                {recipe.instructions.map((instruction, index) => (
                  <li key={`${recipe.id}-${index}`}>{instruction}</li>
                ))}
              </ol>
            </div>
            <div style={{position:'relative'}}>
              
              <p className="ratings">ratings : {recipe.rating} /5      total reviews  : {recipe.reviewCount}</p>
            </div>
            <hr style={{backgroundColor:"yellow"}}/>
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;