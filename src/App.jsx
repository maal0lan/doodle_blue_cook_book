import { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  const [recipes, setCookbook] = useState([]);
  const [status, setStatus] = useState(true);
  const [status_check, set_status_check] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "", username: "" });
  const [flag, setFlag] = useState(false);


  useEffect(() => {
    const fetchCookbook = async () => {
      setStatus(true);
      set_status_check(false);

      try {
        const response = await fetch("https://dummyjson.com/recipes");
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCookbook(data.recipes);
        set_status_check(data.recipes.length > 0);

      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setStatus(false);
      }
    };

    fetchCookbook();
  }, []);

  if (status) {
    return <div className="loading">contacting gordan ramsay</div>;
  }
  if (!flag) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      
       <h1 style={{color:'white', fontSize:'60px', textAlign:'left'}}>let's login</h1>
    
       
       
        <div className="login-shi" style={{}}>
          <ul>
            Enter your name: <input type="text" className="input-box" onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
          </ul>
          <ul>
            Enter your email: <input type="text" className="input-box" onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
          </ul>
          <ul>
            Enter your username: <input type="text" className="input-box" onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
          </ul>
          <button type="submit" className="submit-button" onClick={() => setFlag(true)}>Submit</button>

        </div>

      </div>

    )
  }

  if (!status_check || recipes.length === 0) {
    return (
      <main className="recipe-list">
        <span className="hero-head">Recipes</span>
        <p>No recipes found.</p>
      </main>
    );
  }

  return (
    <main className="recipe-list">
      <div className="top-thing">
        <p className="welcome">welcome back {userData.name}</p>
        <div className="about-user">
        <p>user id : {userData.username}</p>
        <p>mail id : {userData.email}</p>
      </div>
      
      </div>
      
      <input type="text" className="input-box" onChange={(e) => setSearchTerm(e.target.value)} />
      <br />
      <p style={{ color: 'white', textAlign: 'right' }}>{searchTerm}</p>
      
      <hr />
     
     
     
      <span className="hero-head">Recipes</span>
      <div className="recipes">
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img className="recipe-image" src={recipe.image} alt={recipe.name} />

            <div className="recipe-content">
              <span style={{ fontSize: "50px" }}>
                {recipe.id}. {recipe.name}
              </span>

              <p className="recipe-details">
                {recipe.cuisine} · {recipe.difficulty} · {recipe.caloriesPerServing} calories
              </p>

              <p className="infos">
                Prep: {recipe.prepTimeMinutes} min · Cook: {recipe.cookTimeMinutes} min · Serves: {recipe.servings} · Meal type: {recipe.mealType.join(" , ")}
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

            <div style={{ position: "relative" }}>
              <p className="ratings">
                ratings: {recipe.rating} / 5 · total reviews: {recipe.reviewCount}
              </p>
            </div>

            <hr style={{ backgroundColor: "yellow" }} />
          </div>
        ))}
      </div>
    </main>
  );
};

export default App;