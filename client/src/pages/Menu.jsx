import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import MealCard from "../components/MealCard.jsx";

/**
 * Menu page. Fetches meals from the backend and allows visitors to
 * search and filter by category. Displays results in a responsive grid.
 */
export default function Menu() {
  const [meals, setMeals] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getMeals()
      .then((res) => {
        setMeals(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load meals");
        setLoading(false);
      });
  }, []);

  // Derive a sorted list of unique categories. Always include "All".
  const categories = useMemo(() => {
    const cats = new Set();
    meals.forEach((m) => {
      if (m.category) cats.add(m.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, [meals]);

  // Filter meals based on search query and active category.
  const filtered = meals.filter((meal) => {
    const matchesQ = (meal.name + " " + meal.category)
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCat = activeCat === "All" || meal.category === activeCat;
    return matchesQ && matchesCat;
  });

  return (
    <main className="section">
      <div className="container">
        {/* Header */}
        <div className="section-title">
          <h2>Our Menu</h2>
          <p>Select from a variety of dishes below or use the search box.</p>
        </div>

        {/* Search & category filter */}
        <input
          type="text"
          placeholder="Search meals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: "420px" }}
        />
        <div className="pills">
          {categories.map((cat) => (
            <div
              key={cat}
              className={"pill" + (activeCat === cat ? " active" : "")}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Meals grid */}
        {loading ? (
          <p style={{ marginTop: 32 }}>Loading meals...</p>
        ) : error ? (
          <p style={{ marginTop: 32, color: "#f87171" }}>{error}</p>
        ) : filtered.length === 0 ? (
          <p style={{ marginTop: 32 }}>No meals match your search.</p>
        ) : (
          <div className="grid cols-3" style={{ marginTop: 32 }}>
            {filtered.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
