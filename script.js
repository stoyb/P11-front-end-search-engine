import { recipes } from "/recipes.js";
import { recipeFactory } from "/recipeCard.js";

const champRechercheIngredients = document.querySelector("#bloc-food__input");
const listeSuggestionsIngredients = document.querySelector("#bloc-food__list");
const champRechercheAppliance = document.querySelector("#bloc-machine__input");
const listeSuggestionsAppliance = document.querySelector("#bloc-machine__list");
const champRechercheUtensils = document.querySelector("#bloc-utensils__input");
const listeSuggestionsUtensils = document.querySelector("#bloc-utensils__list");
const listOfRecipes = document.querySelector(".list-recipes");
const searchRecipe = document.querySelector("#search-recipe___input");
const listFilters = document.querySelector('.list-filters');
let dataIngredients = []; 
let dataAppliance = [];
let dataUtensils = [];

// Create the filtered lists of filters 
let state = {
    ingredients : dataIngredients,
    appliance : dataAppliance, 
    utensils : dataUtensils, 
    keyword : []
}
console.log(state.ingredients);
 
function filterAllList(list) {
    const uniqueItems = [...new Set(list)];
    return uniqueItems
}

function getRecipes() {
    const valeurRecherche = searchRecipe.value.toLowerCase();
  
    if (valeurRecherche.length == 0) {
      listOfRecipes.innerHTML = "";
      displayRecipes(recipes);
      if (listOfRecipes.style.display == "inline-block") {
        listOfRecipes.style.display = "grid";
        displayRecipes(recipes);
      }
    } else if (valeurRecherche.length >= 3) {
      state.ingredients.forEach((item) => {
        if (item.toLowerCase().includes(valeurRecherche) && item.toLowerCase().endsWith(valeurRecherche)) {
          state.keyword.push(valeurRecherche);
        }
      });
    }
    state.keyword = filterAllList(state.keyword);
    console.log(state.keyword);
  
    const suggestionsName = recipes.filter(item =>
      item.name.toLowerCase().includes(" " + valeurRecherche + " ") || item.name.toLowerCase().endsWith(valeurRecherche + " ")
    );
    const suggestionsDescription = recipes.filter(item =>
      item.description.toLowerCase().startsWith(valeurRecherche) || item.description.toLowerCase().includes(" " + valeurRecherche + " ") || item.description.toLowerCase().endsWith(valeurRecherche + " ")
    );
    const suggestionsIngredients = recipes.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        ingredient.ingredient.toLowerCase().includes(valeurRecherche)
      )
    );
  
    listOfRecipes.innerHTML = "";
    const allSuggestions = [
      ...suggestionsName,
      ...suggestionsDescription,
      ...suggestionsIngredients
    ];
  
    if (allSuggestions.length === 0) {
      listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + valeurRecherche + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
      listOfRecipes.style.display = "inline-block";
    }
    displayRecipes(filterAllList(allSuggestions));
    dataIngredients.splice(0, dataIngredients.length);
    dataIngredients = getUniqueItems(getAllIngredients, dataIngredients, allSuggestions);
    dataAppliance.splice(0, dataAppliance.length);
    dataAppliance = getUniqueItems(getAllAppliance, dataAppliance, allSuggestions);
    dataUtensils.splice(0, dataUtensils.length);
    dataUtensils = getUniqueItems(getAllUtensils, dataUtensils, allSuggestions);
    console.log(dataIngredients);
    const filterListrecipes = filterAllList(allSuggestions);
    return filterListrecipes;
}

function getAllIngredients(recipes) {
    const ingredientsAll = [];
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsAll.push(ingredient.ingredient.toLowerCase());
        });
    });
    
    return ingredientsAll;
}
function getAllAppliance(recipes) {
    const applianceAll = [];
    recipes.forEach(recipe => {
        applianceAll.push(recipe.appliance.toLowerCase());
    });
    
    return applianceAll;
}
function getAllUtensils(recipes) {
    const utensilsAll = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((item) => {
            utensilsAll.push(item.toLowerCase());
        });
    });
    return utensilsAll;
}
// Function to remove the occurrences 


// Factorized function to generate the three filteredLists without occurrences 
function getUniqueItems(getAFilter, dataList, recipes){
    const itemsList = getAFilter(recipes);
    const filteredList = filterAllList(itemsList);
    filteredList.forEach((item) => {
        dataList.push(item);
    })
    return dataList
}

console.log(getUniqueItems(getAllIngredients, dataIngredients, recipes));
console.log(getUniqueItems(getAllAppliance, dataAppliance, recipes));
console.log(getUniqueItems(getAllUtensils, dataUtensils, recipes));

function recipesWithIngredientsFilter(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
        const filterButton = document.createElement('p');
        filterButton.classList.add(filterButtonClass);
        filterButton.textContent = item;
        listFilters.appendChild(filterButton);
        let dataKeyword = state.keyword;
        dataKeyword.push(item);
        console.log(dataKeyword);
        listeSuggestionsIngredients.innerHTML = " ";
        state.ingredients = state.ingredients.filter((element) =>
            dataKeyword.every((keyword) =>
                !element.toLowerCase().includes(keyword.toLowerCase()) 
        ));
        state.ingredients.forEach(suggestion => {
        const option = document.createElement("li");
        option.classList.add("li-ingredients");
        option.textContent = suggestion;
        listeSuggestionsIngredients.appendChild(option);
        });
        const exportedRecipes = getRecipes();
        console.log(exportedRecipes);
        const suggIngredients = exportedRecipes.filter((recipe) =>
                dataKeyword.every((keyword) =>
                    recipe.ingredients.some((ingredient) =>
                        ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
                    )
                )
         );

        listeSuggestionsIngredients.innerHTML = " ";
        state.ingredients = filterAllList(getAllIngredients(suggIngredients));
        console.log(state.ingredients);
        state.appliance = filterAllList(getAllAppliance(suggIngredients));
        state.utensils = filterAllList(getAllUtensils(suggIngredients));
        // state.ingredients.forEach(suggestion => {
        //     const option = document.createElement("li");
        //     option.classList.add("li-ingredients");
        //     option.textContent = suggestion;
        //     listeSuggestionsIngredients.appendChild(option);
        //     });
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggIngredients);
        //const searchRecipeValue = searchRecipe.value.toLowerCase();
            //     if (searchRecipeValue.length >= 3) {
            //         state.ingredients = state.ingredients.filter(item =>
            //                     item.toLowerCase().startsWith(searchRecipeValue) || item.toLowerCase().includes(" " + searchRecipeValue) || item.toLowerCase().endsWith(searchRecipeValue + " ") && !dataKeyword.includes(item) && !item.startsWith(dataKeyword)
            //                 );
        
            //     dataKeyword.push(searchRecipeValue);
            //     dataKeyword = filterAllList(dataKeyword);
            // }
            console.log(dataKeyword);
        
    });
}

function recipesWithAppliancelFilter(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
        const filterButton = document.createElement('p');
        let dataKeyword = state.keyword;
        filterButton.classList.add(filterButtonClass);
        filterButton.textContent = item;
        listFilters.appendChild(filterButton);
        dataKeyword.push(item);
        console.log(dataKeyword);
        listeSuggestionsAppliance.innerHTML = " ";
        listeSuggestionsAppliance.addEventListener('input', function() {
        console.log(suggestionsAppliance);
        state.appliance.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsAppliance.appendChild(option);
        });
    });
        const suggAppliance = recipes.filter((recipe) =>
        dataKeyword.every((keyword) =>
        recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
        recipe.appliance.toLowerCase().includes(keyword.toLowerCase())
        )
        );
        state.ingredients = filterAllList(getAllIngredients(suggAppliance));
        state.appliance = filterAllList(getAllAppliance(suggAppliance));
        state.utensils = filterAllList(getAllUtensils(suggAppliance));
        state.appliance = state.appliance.filter((element) =>
        dataKeyword.every((keyword) =>
        !element.toLowerCase().includes(keyword.toLowerCase()) 
        ));
        console.log(state.appliance);
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggAppliance);


        const searchRecipeValue = searchRecipe.value.toLowerCase();
        if (searchRecipeValue.length >= 3) {
            state.appliance = state.appliance.filter(item =>
                        item.toLowerCase().startsWith(searchRecipeValue) || item.toLowerCase().includes(" " + searchRecipeValue) || item.toLowerCase().endsWith(searchRecipeValue + " ") && !dataKeyword.includes(item) && !item.startsWith(dataKeyword)
                    );

        dataKeyword.push(searchRecipeValue);
        console.log(dataKeyword);
        }
    });
}



function recipesWithUtensilslFilter(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
        const filterButton = document.createElement('p');
        filterButton.classList.add(filterButtonClass);
        filterButton.textContent = item;
        listFilters.appendChild(filterButton);
        let dataKeyword = state.keyword;
        dataKeyword.push(item);
        console.log(dataKeyword);
        listeSuggestionsUtensils.innerHTML = " ";
        state.utensils = state.utensils.filter((element) =>
        dataKeyword.every((keyword) =>
        !element.toLowerCase().includes(keyword.toLowerCase()) 
        )
        );
        console.log(suggestionsUtensils);
        listeSuggestionsUtensils.addEventListener('input', function() {
            state.utensils.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsUtensils.appendChild(option);
        });
    });
        const suggUtensils = recipes.filter((recipe) =>
              dataKeyword.some((keyword) =>
                recipe.ustensils.some((item) =>
                        item.toLowerCase().includes(keyword.toLowerCase())
                    )
              )
            );

        state.ingredients = filterAllList(getAllIngredients(suggAppliance));
        state.appliance = filterAllList(getAllAppliance(suggAppliance));
        state.utensils = filterAllList(getAllUtensils(suggAppliance));
        state.utensils = state.utensils.filter((element) =>
        dataKeyword.every((keyword) =>
        !element.toLowerCase().includes(keyword.toLowerCase())
        ));
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggUtensils);

        const searchRecipeValue = searchRecipe.value.toLowerCase();
        if (searchRecipeValue.length >= 3) {
            state.utensils = state.utensils.filter(item =>
                item.toLowerCase().startsWith(searchRecipeValue) || item.toLowerCase().includes(" " + searchRecipeValue) || item.toLowerCase().endsWith(searchRecipeValue + " ") && !dataKeyword.includes(item) && !item.startsWith(dataKeyword)
            );
            dataKeyword.push(searchRecipeValue); 
        }
    });
}


function showSuggestionsIngredients() {
    const valeurRecherche = champRechercheIngredients.value.toLowerCase();
    listeSuggestionsIngredients.innerHTML = " "; 
    if (valeurRecherche.length == 0 ) {
        let dataListItems
        dataListItems = state.ingredients;
        dataListItems.forEach(item => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsIngredients.appendChild(option);  
            recipesWithIngredientsFilter(option, item, 'filter-button__ingredients');
            
        });
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.ingredients.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche) || item.toLowerCase().includes(" " + valeurRecherche) || item.toLowerCase().endsWith(valeurRecherche + " ")
            );
        suggestions.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsIngredients.appendChild(option);
            recipesWithIngredientsFilter(option, suggestion, 'filter-button__ingredients');
            });
    }
}

function showSuggestionsAppliance() {
    const valeurRecherche = champRechercheAppliance.value.toLowerCase();
    listeSuggestionsAppliance.innerHTML = " "; 
    if (valeurRecherche.length == 0 ) {
        let dataListItems
        dataListItems = state.appliance;
        dataListItems.forEach(item => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsAppliance.appendChild(option);  
            recipesWithAppliancelFilter(option, item,  'filter-button__appliance');
        });
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.appliance.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche) || item.toLowerCase().includes(" " + valeurRecherche) || item.toLowerCase().endsWith(valeurRecherche + " ")
            );
        suggestions.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsAppliance.appendChild(option);
            recipesWithAppliancelFilter(option, suggestion, 'filter-button__appliance');
            });
    }
}

function showSuggestionsUtensils() {
    const valeurRecherche = champRechercheUtensils.value.toLowerCase();
    listeSuggestionsUtensils.innerHTML = " "; 
    if (valeurRecherche.length == 0 ) {
        let dataListItems = state.utensils;
        dataListItems.forEach(item => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsUtensils.appendChild(option);  
            recipesWithUtensilslFilter(option, item, 'filter-button__utensils');
        });
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.utensils.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche) || item.toLowerCase().includes(" " + valeurRecherche) || item.toLowerCase().endsWith(valeurRecherche + " ")
            );
        suggestions.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsUtensils.appendChild(option);
            recipesWithUtensilslFilter(option, suggestion, 'filter-button__utensils');
            });
    }
}
      
function displayRecipes(recipes) {
    recipes.forEach((recipe)=> {
        const modelCard = recipeFactory(recipe);
        const cardRecipe = modelCard.getRecipeCardDOM();
        listOfRecipes.appendChild(cardRecipe);
        
    })
}

// function addAKeyword(word) {
//     let dataIngredients = state.ingredients;
//     let dataAppliance = state.appliance;
//     let dataUtensils = state.utensils; 
//     let dataKeyword = state.keyword;
//     if(word.length >= 3) {
//     dataIngredients.forEach((item)=> {
//         if(item.endsWith(word)|| item.includes(word + " ")|| item.endsWith(word + "s")) {
//             dataKeyword.push(item);
//             //dataKeyword = dataKeyword + item;
//         }
//     })
//     dataAppliance.forEach((item)=> {
//         if(item.endsWith(word)|| item.includes(word + " ")|| item.endsWith(word + "s")) {
//             dataKeyword.push(item);
//             //dataKeyword = dataKeyword + item;
//         }
//     })
//     dataUtensils.forEach((item)=> {
//         if(item.endsWith(word)|| item.includes(word + " ")|| item.endsWith(word + "s")) {
//            dataKeyword.push(item);
//             //dataKeyword = dataKeyword + item;
//         }
//     })
//     }
//      return filterAllList(dataKeyword);
// }


  


champRechercheIngredients.addEventListener("input",showSuggestionsIngredients);
champRechercheAppliance.addEventListener("input",showSuggestionsAppliance);
champRechercheUtensils.addEventListener("input",showSuggestionsUtensils);
searchRecipe.addEventListener("input", getRecipes);
displayRecipes(recipes);

   


    

    