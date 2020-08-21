import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there");
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...currentHttpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return { ...currentHttpState, error: null };
    default:
      throw new Error("Should not get there");
  }
};

const Ingredients = () => {
  // const [userIngredients, setUserIngredients] = useState([]);
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch("https://react-hooks-f5d3c.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((resData) => {
        // setIsLoading(false);
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: resData.name, ...ingredient },
        // ]);
        dispatchHttp({ type: "RESPONSE" });
        dispatch({
          type: "ADD",
          ingredient: { id: resData.name, ...ingredient },
        });
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    setTimeout(() => {
      fetch(
        `https://react-hooks-f5d3c.firebaseio.com/ingredients/${ingredientId}.json`,
        {
          method: "DELETE",
        }
      )
        .then((res) => {
          // setIsLoading(false);
          dispatchHttp({ type: "RESPONSE" });
          // setUserIngredients(
          //   userIngredients.filter(
          //     (ingredient) => ingredient.id !== ingredientId
          //   )
          // );
          dispatch({ type: "DELETE", id: ingredientId });
        })
        .catch((err) => {
          // setError(err.message);
          dispatchHttp({ type: "ERROR", errorData: err.message });
        });
    }, 1000);
  };

  const filteredIngredients = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const clearError = useCallback(() => {
    // setError(null);
    // setIsLoading(false);
    dispatchHttp({ type: "CLEAR" });
  });

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {/* {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>} */}
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredients} />
        {ingredientList}
        {/* <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        /> */}
      </section>
    </div>
  );
};

export default Ingredients;
