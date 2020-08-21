import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // useEffect(() => {
  //   fetch("https://react-hooks-f5d3c.firebaseio.com/ingredients.json")
  //     .then((resposne) => resposne.json())
  //     .then((resData) => {
  //       const loadedIngredient = [];
  //       for (let key in resData) {
  //         loadedIngredient.push({
  //           id: key,
  //           title: resData[key].title,
  //           amount: resData[key].amount,
  //         });
  //       }
  //       setUserIngredients(loadedIngredient);
  //     });
  // }, []);

  useEffect(() => {
    console.log("Rendering Ing", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch("https://react-hooks-f5d3c.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((resData) => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: resData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    setTimeout(() => {
      fetch(
        `https://react-hooks-f5d3c.firebaseio.com/ingredients/${ingredientId}.json`,
        {
          method: "DELETE",
        }
      )
        .then((res) => {
          setIsLoading(false);
          setUserIngredients((prevIngredients) =>
            prevIngredients.filter(
              (ingredient) => ingredient.id !== ingredientId
            )
          );
        })
        .catch((err) => {
          setError(err.message);
        });
    }, 1000);
  };

  const filteredIngredients = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredients} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
