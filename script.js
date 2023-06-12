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
function filterAllList(list) {
    const uniqueItems = [...new Set(list)];
    return uniqueItems
}

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


function recipesWithIngredientsFilter(option, item, listeSuggestions, filterButtonClass) {
    option.addEventListener('click', function() {
        const filterButton = document.createElement('p');
        filterButton.classList.add(filterButtonClass);
        filterButton.textContent = item;
        listFilters.appendChild(filterButton);
        listeSuggestions.innerHTML = " ";
        listOfRecipes.innerHTML = " ";
        // Affiche le résultat des recherches dans listOfRecipes
        recipes.forEach((recipe) => {
            recipe.ingredients.forEach((ingredients) => {
            if (ingredients.ingredient.toLowerCase() === item.toLowerCase()) {
                const modelCard = recipeFactory(recipe);
                const cardRecipe = modelCard.getRecipeCardDOM();
                listOfRecipes.appendChild(cardRecipe);
                
            }
            });
        });
    });
}

function recipesWithAppliancelFilter(option, item, listeSuggestions, filterButtonClass) {
    option.addEventListener('click', function() {
        const filterButton = document.createElement('p');
        filterButton.classList.add(filterButtonClass);
        filterButton.textContent = item;
        listFilters.appendChild(filterButton);
        listeSuggestions.innerHTML = " ";
        listOfRecipes.innerHTML = " ";
        // Affiche le résultat des recherches dans listOfRecipes
        recipes.forEach((recipe) => {
            if (recipe.appliance.toLowerCase() === item.toLowerCase()) {
                const modelCard = recipeFactory(recipe);
                const cardRecipe = modelCard.getRecipeCardDOM();
                listOfRecipes.appendChild(cardRecipe);
            }
           
        });
    });
}

function recipesWithUtensilslFilter(option, item, listeSuggestions, filterButtonClass) {
    option.addEventListener('click', function() {
        const filterButton = document.createElement('p');
        filterButton.classList.add(filterButtonClass);
        filterButton.textContent = item;
        listFilters.appendChild(filterButton);
        listeSuggestions.innerHTML = " ";
        listOfRecipes.innerHTML = " ";
        // Affiche le résultat des recherches dans listOfRecipes
        recipes.forEach((recipe) => {
            recipe.ustensils.forEach((utensil) => {
            if (utensil.toLowerCase() === item.toLowerCase()) {
                const modelCard = recipeFactory(recipe);
                const cardRecipe = modelCard.getRecipeCardDOM();
                listOfRecipes.appendChild(cardRecipe);
                
            }
            });
        });
    });
}



function showSuggestionsIngredients() {
    const valeurRecherche = champRechercheIngredients.value.toLowerCase();
    let dataKeyword = state.keyword;
    dataKeyword = dataKeyword + valeurRecherche 
    
    console.log(dataKeyword);
    listeSuggestionsIngredients.innerHTML = " "; 
    if (valeurRecherche.length == 0 ) {
        let dataListItems = state.ingredients;
        dataListItems.forEach(item => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsIngredients.appendChild(option);  
            recipesWithIngredientsFilter(option, item, listeSuggestionsIngredients, 'filter-button__ingredients');
            recipes.forEach((recipe) => {
                recipe.ingredients.forEach((ingredients) => {
                if (ingredients.ingredient.toLowerCase() === item.toLowerCase()) {
                    const modelCard = recipeFactory(recipe);
                    const cardRecipe = modelCard.getRecipeCardDOM();
                    listOfRecipes.appendChild(cardRecipe);
                }
                });
            });
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
            recipesWithIngredientsFilter(option, suggestion, listeSuggestionsIngredients, 'filter-button__ingredients');
             
            });
    }
}

function showSuggestionsAppliance() {
    const valeurRecherche = champRechercheAppliance.value.toLowerCase();
    listeSuggestionsAppliance.innerHTML = " "; 
    if (valeurRecherche.length == 0 ) {
        let dataListItems = state.appliance;
        dataListItems.forEach(item => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsAppliance.appendChild(option);  
            recipesWithAppliancelFilter(option, item, listeSuggestionsAppliance, 'filter-button__appliance');
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
            recipesWithAppliancelFilter(option, suggestion, listeSuggestionsAppliance, 'filter-button__appliance');
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
            recipesWithUtensilslFilter(option, item, listeSuggestionsUtensils, 'filter-button__utensils');
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
            recipesWithUtensilslFilter(option, suggestion, listeSuggestionsUtensils, 'filter-button__utensils');
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

function addAKeyword(word) {
    let dataIngredients = state.ingredients;
    let dataAppliance = state.appliance;
    let dataUtensils = state.utensils; 
    let dataKeyword = state.keyword;
    if(word.length >= 3) {
    dataIngredients.forEach((item)=> {
        if(item.endsWith(word)|| item.includes(word + " ")|| item.endsWith(word + "s")) {
            dataKeyword.push(item);
            //dataKeyword = dataKeyword + item;
        }
    })
    dataAppliance.forEach((item)=> {
        if(item.endsWith(word)|| item.includes(word + " ")|| item.endsWith(word + "s")) {
            dataKeyword.push(item);
            //dataKeyword = dataKeyword + item;
        }
    })
    dataUtensils.forEach((item)=> {
        if(item.endsWith(word)|| item.includes(word + " ")|| item.endsWith(word + "s")) {
           dataKeyword.push(item);
            //dataKeyword = dataKeyword + item;
        }
    })
    }
     return filterAllList(dataKeyword);
}

function getRecipes() {
    const valeurRecherche = searchRecipe.value.toLowerCase();
    // const keyWords = addAKeyword(valeurRecherche);
    // const filteredList = filterAllList(keyWords);
    // console.log(filteredList);
  
    if (valeurRecherche.length == 0) {
      listOfRecipes.innerHTML = "";
      displayRecipes(recipes);
    } else if (valeurRecherche.length >= 3) {
      const suggestionsName = recipes.filter(item =>
        item.name.toLowerCase().includes(" " + valeurRecherche + " ") || item.name.toLowerCase().endsWith(valeurRecherche + " ")
      );
      const suggestionsDescription = recipes.filter(item =>
        item.description.toLowerCase().includes(" " + valeurRecherche + " ") || item.description.toLowerCase().endsWith(valeurRecherche + " ")
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
  
      displayRecipes(filterAllList(allSuggestions));
      dataIngredients.splice(0, dataIngredients.length);
      dataIngredients = getUniqueItems(getAllIngredients, dataIngredients, allSuggestions);
      dataAppliance.splice(0, dataAppliance.length);
      dataAppliance = getUniqueItems(getAllAppliance, dataAppliance, allSuggestions);
      dataUtensils.splice(0, dataUtensils.length);
      dataUtensils = getUniqueItems(getAllUtensils, dataUtensils, allSuggestions);
      console.log(dataIngredients);
      
    }
  }
  


champRechercheIngredients.addEventListener("input",showSuggestionsIngredients);
champRechercheAppliance.addEventListener("input",showSuggestionsAppliance);
champRechercheUtensils.addEventListener("input",showSuggestionsUtensils);
searchRecipe.addEventListener("input", getRecipes);
displayRecipes(recipes);

   


    

    