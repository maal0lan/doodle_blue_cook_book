import { useEffect, useState } from "react";
import Button from "./components/Button";
import "./App.css";

const ITEMS_PER_PAGE = 5;

const App = () => {
  const [recipes, setCookbook] = useState([]);
  const [status, setStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [status_check, set_status_check] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [userData, setUserData] = useState(() => {
    try {
      const savedUser = localStorage.getItem("recipe_user_data");
      return savedUser ? JSON.parse(savedUser) : { name: "", email: "", username: "" };
    } catch {
      return { name: "", email: "", username: "" };
    }
  });

  const [flag, setFlag] = useState(() => {
    try {
      return localStorage.getItem("recipe_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);

   const [showModal, setShowModal] = useState(false);
  const [isSubmittingRecipe, setIsSubmittingRecipe] = useState(false);
  const [recipeSuccessMsg, setRecipeSuccessMsg] = useState("");
  const [recipeErrorMsg, setRecipeErrorMsg] = useState("");
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    cuisine: "Italian",
    difficulty: "Easy",
    caloriesPerServing: 350,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 2,
    mealType: "Dinner",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    ingredients: "",
    instructions: "",
  });

  const fetchCookbook = async () => {
    setStatus(true);
    set_status_check(false);
    setErrorMessage("");

    try {
      const response = await fetch("https://dummyjson.com/recipes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.recipes || !Array.isArray(data.recipes)) {
        throw new Error("Invalid response format received from kitchen");
      }
      setCookbook(data.recipes);
      set_status_check(data.recipes.length > 0);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setErrorMessage(error.message || "Failed to contact Gordon Ramsay!");
    } finally {
      setStatus(false);
    }
  };

  useEffect(() => {
    fetchCookbook();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userData.name && !userData.username) {
      alert("Please enter your name or username!");
      return;
    }
    try {
      localStorage.setItem("recipe_user_data", JSON.stringify(userData));
      localStorage.setItem("recipe_logged_in", "true");
    } catch (err) {
      console.error("Failed to save to local cache:", err);
    }
    setFlag(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("recipe_logged_in");
    } catch (err) {
      console.error("Failed to clear local cache:", err);
    }
    setFlag(false);
  };

  const handleAddRecipeSubmit = async (e) => {
    e.preventDefault();
    if (!newRecipe.name.trim()) {
      alert("Please give the recipe a name!");
      return;
    }

    setIsSubmittingRecipe(true);
    setRecipeErrorMsg("");
    setRecipeSuccessMsg("");

    const payload = {
      name: newRecipe.name.trim(),
      cuisine: newRecipe.cuisine,
      difficulty: newRecipe.difficulty,
      caloriesPerServing: Number(newRecipe.caloriesPerServing) || 250,
      prepTimeMinutes: Number(newRecipe.prepTimeMinutes) || 10,
      cookTimeMinutes: Number(newRecipe.cookTimeMinutes) || 15,
      servings: Number(newRecipe.servings) || 2,
      mealType: [newRecipe.mealType],
      rating: 5.0,
      reviewCount: 1,
      image: newRecipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      ingredients: newRecipe.ingredients
        ? newRecipe.ingredients.split("\n").map((s) => s.trim()).filter(Boolean)
        : ["Special Spices", "Chef's Touch"],
      instructions: newRecipe.instructions
        ? newRecipe.instructions.split("\n").map((s) => s.trim()).filter(Boolean)
        : ["Cook with fire and love.", "Serve hot!"],
    };

    try {
      const res = await fetch("https://dummyjson.com/recipes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to add recipe (status ${res.status})`);
      }

      const created = await res.json();
      console.log("DummyJSON added recipe response:", created);

      const recipeWithFallback = {
        ...payload,
        id: created.id || Date.now(),
      };
      setCookbook((prev) => [recipeWithFallback, ...prev]);
      setRecipeSuccessMsg("Recipe added to cookbook successfully!");

      setTimeout(() => {
        setShowModal(false);
        setRecipeSuccessMsg("");
        setNewRecipe({
          name: "",
          cuisine: "Italian",
          difficulty: "Easy",
          caloriesPerServing: 350,
          prepTimeMinutes: 15,
          cookTimeMinutes: 20,
          servings: 2,
          mealType: "Dinner",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          ingredients: "",
          instructions: "",
        });
        setCurrentPage(1);
      }, 1000);
    } catch (err) {
      console.error("Error adding recipe:", err);
      setRecipeErrorMsg(err.message || "Failed to post recipe");
    } finally {
      setIsSubmittingRecipe(false);
    }
  };

  if (status) {
    return <div className="loading">contacting gordan ramsay...</div>;
  }

  if (errorMessage) {
    return (
      <main className="recipe-list">
        <span className="hero-head">Kitchen Disaster!</span>
        <p style={{ color: "red", fontSize: "24px", fontFamily: '"Geist Pixel", sans-serif' }}>
          Error: {errorMessage}
        </p>
        <Button
          variant="submit"
          style={{ marginTop: "20px" }}
          onClick={fetchCookbook}
        >
          Try Contacting Gordon Again
        </Button>
      </main>
    );
  }

  if (!flag) {
    return (
      <div className="login-screen-wrapper">
        <div className="login-card">
          <div className="login-header">
            <span className="hero-head" style={{ fontSize: "52px", margin: 0 }}>let's login</span>
            <p className="login-subtitle">why are you even here?</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="login-input-group">
              <label>Enter your name</label>
              <input
                type="text"
                required
                placeholder="e.g. Gordon Ramsay"
                value={userData.name}
                className="input-box login-field"
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>

            <div className="login-input-group">
              <label>Enter your email</label>
              <input
                type="email"
                placeholder="e.g. gordon@kitchen.com"
                value={userData.email}
                className="input-box login-field"
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>

            <div className="login-input-group">
              <label>Enter your username</label>
              <input
                type="text"
                placeholder="e.g. lamb_sauce_404"
                value={userData.username}
                className="input-box login-field"
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              />
            </div>

            <Button type="submit" variant="primary" style={{ marginTop: "10px", width: "100%" }}>
              Enter Kitchen
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (!status_check || recipes.length === 0) {
    return (
      <main className="recipe-list">
        <span className="hero-head">Recipes</span>
        <p style={{ color: "yellow" }}>No recipes found.</p>
        <Button
          variant="submit"
          style={{ marginTop: "20px" }}
          onClick={fetchCookbook}
        >
          Reload
        </Button>
      </main>
    );
  }

   const query = searchTerm.toLowerCase().trim();
  const filteredRecipes = recipes.filter((recipe) => {
    if (!query) return true;
    const nameMatch = recipe.name?.toLowerCase().includes(query);
    const cuisineMatch = recipe.cuisine?.toLowerCase().includes(query);
    const ingredientMatch = recipe.ingredients?.some((item) =>
      item.toLowerCase().includes(query)
    );
    const mealTypeMatch = recipe.mealType?.some((mt) =>
      mt.toLowerCase().includes(query)
    );
    return nameMatch || cuisineMatch || ingredientMatch || mealTypeMatch;
  });

  // PAGINATION AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="recipe-list">
      <header className="top-thing">
        <div className="header-user-row">
          <div className="welcome-banner">
            <span className="welcome">welcome back {userData.name || "Chef"}</span>
          </div>

          <div className="about-user">
            <div className="user-details-text">
              <span>user id : {userData.username || "anonymous"}</span>
              <span>mail id : {userData.email || "none"}</span>
            </div>
            <Button
              variant="logout"
              onClick={handleLogout}
            >
              Logout / Switch
            </Button>
          </div>
        </div>

        <div className="controls-row">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            + Add Recipe
          </Button>

          <div className="search-box-wrapper">
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisine..."
              value={searchTerm}
              className="input-box"
              onChange={handleSearchChange}
            />
            <span className="search-stats">
              {searchTerm ? `Found: ${filteredRecipes.length} recipes` : `Total recipes: ${recipes.length}`}
            </span>
          </div>
        </div>
      </header>

      <hr style={{ borderColor: "#333", margin: "25px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="hero-head">Recipes</span>
        <span style={{ color: "yellow", fontSize: "20px", fontFamily: '"Jacquard 12", system-ui' }}>
          Page {safeCurrentPage} of {totalPages}
        </span>
      </div>

      {currentRecipes.length === 0 ? (
        <p style={{ color: "yellow", fontSize: "24px", margin: "40px 0" }}>
          No matching recipes found for "{searchTerm}".
        </p>
      ) : (
        <div className="recipes">
          {currentRecipes.map((recipe) => (
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
                  Prep: {recipe.prepTimeMinutes} min · Cook: {recipe.cookTimeMinutes} min · Serves: {recipe.servings} · Meal type: {recipe.mealType?.join(" , ")}
                </p>

                <span className="sub-topic">Ingredients</span>
                <ul>
                  {recipe.ingredients?.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>

                <span className="sub-topic">Instructions</span>
                <ol>
                  {recipe.instructions?.map((instruction, index) => (
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
      )}

      {/* Pagination Controls */}
      {filteredRecipes.length > ITEMS_PER_PAGE && (
        <div className="pagination-bar">
          <Button
            variant="pagination"
            disabled={safeCurrentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            &lt; Prev
          </Button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant="pagination-num"
                className={safeCurrentPage === pageNum ? "active-page" : ""}
                onClick={() => {
                  setCurrentPage(pageNum);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          <Button
            variant="pagination"
            disabled={safeCurrentPage === totalPages}
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next &gt;
          </Button>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="hero-head" style={{ fontSize: "36px", margin: 0 }}>
                Cook Something New
              </span>
              <Button
                variant="close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </Button>
            </div>

            {recipeSuccessMsg && (
              <p style={{ color: "rgb(0, 255, 0)", fontSize: "20px" }}>{recipeSuccessMsg}</p>
            )}
            {recipeErrorMsg && (
              <p style={{ color: "red", fontSize: "20px" }}>{recipeErrorMsg}</p>
            )}

            <form onSubmit={handleAddRecipeSubmit} className="modal-form">
              <label>
                Recipe Name *
                <input
                  type="text"
                  required
                  className="modal-input"
                  placeholder="e.g. Grandma's Secret Pasta"
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                />
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label>
                  Cuisine
                  <input
                    type="text"
                    className="modal-input"
                    value={newRecipe.cuisine}
                    onChange={(e) => setNewRecipe({ ...newRecipe, cuisine: e.target.value })}
                  />
                </label>
                <label>
                  Difficulty
                  <select
                    className="modal-input"
                    value={newRecipe.difficulty}
                    onChange={(e) => setNewRecipe({ ...newRecipe, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <label>
                  Prep (min)
                  <input
                    type="number"
                    className="modal-input"
                    value={newRecipe.prepTimeMinutes}
                    onChange={(e) => setNewRecipe({ ...newRecipe, prepTimeMinutes: e.target.value })}
                  />
                </label>
                <label>
                  Cook (min)
                  <input
                    type="number"
                    className="modal-input"
                    value={newRecipe.cookTimeMinutes}
                    onChange={(e) => setNewRecipe({ ...newRecipe, cookTimeMinutes: e.target.value })}
                  />
                </label>
                <label>
                  Calories
                  <input
                    type="number"
                    className="modal-input"
                    value={newRecipe.caloriesPerServing}
                    onChange={(e) => setNewRecipe({ ...newRecipe, caloriesPerServing: e.target.value })}
                  />
                </label>
              </div>

              <label>
                Image URL
                <input
                  type="url"
                  className="modal-input"
                  placeholder="https://..."
                  value={newRecipe.image}
                  onChange={(e) => setNewRecipe({ ...newRecipe, image: e.target.value })}
                />
              </label>

              <label>
                Ingredients (one per line)
                <textarea
                  className="modal-input modal-textarea"
                  rows={3}
                  placeholder="2 cups flour&#10;1 tsp salt&#10;1 cup tomato sauce"
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                />
              </label>

              <label>
                Instructions (one per line)
                <textarea
                  className="modal-input modal-textarea"
                  rows={3}
                  placeholder="Preheat oven to 400F&#10;Mix ingredients in bowl&#10;Bake for 20 mins"
                  value={newRecipe.instructions}
                  onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                <Button
                  type="button"
                  variant="pagination"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmittingRecipe}
                >
                  {isSubmittingRecipe ? "Saving..." : "Submit to Kitchen"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
