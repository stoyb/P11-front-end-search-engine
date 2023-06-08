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
    keyword : ""
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
        listeSuggestions.removeChild(option);
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

function showSuggestionsIngredients() {
    const valeurRecherche = champRechercheIngredients.value.toLowerCase();
    listeSuggestionsIngredients.innerHTML = " "; 
    if (valeurRecherche.length == 0 ) {
        let dataListItems = state.ingredients;
        dataListItems.forEach(item => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsIngredients.appendChild(option);  
            recipesWithIngredientsFilter(option, item, listeSuggestionsIngredients, 'filter-button__ingredients');
        });
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.ingredients.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche)
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
            recipesWithIngredientsFilter(option, item, listeSuggestionsAppliance, 'filter-button__appliance');
        });
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.appliance.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche)
            );
        suggestions.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsAppliance.appendChild(option);
            recipesWithIngredientsFilter(option, suggestion, listeSuggestionsAppliance, 'filter-button__appliance');
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
            recipesWithIngredientsFilter(option, item, listeSuggestionsUtensils, 'filter-button__utensils');
        });
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.appliance.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche)
            );
        suggestions.forEach(suggestion => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = suggestion;
            listeSuggestionsUtensils.appendChild(option);
            recipesWithIngredientsFilter(option, suggestion, listeSuggestionsUtensils, 'filter-button__utensils');
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
    if(state.ingredients.includes(word) ||
    state.appliance.includes(word) ||
    state.utensils.includes(word)) {
        let dataKeyword = state.keyword;
        dataKeyword = dataKeyword + word;
        console.log(dataKeyword);
    }
}

function getRecipes() {
    const valeurRecherche = searchRecipe.value.toLowerCase();
    addAKeyword(valeurRecherche);
    if(valeurRecherche.length <= 1) {
        listOfRecipes.innerHTML = " ";
        displayRecipes(recipes);
    }
    if(valeurRecherche.length >= 1) {
        const suggestions = recipes.filter(item =>
            item.name.toLowerCase().startsWith(valeurRecherche)
            );
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggestions);
    } 
}







champRechercheIngredients.addEventListener("input",showSuggestionsIngredients);
champRechercheAppliance.addEventListener("input",showSuggestionsAppliance);
champRechercheUtensils.addEventListener("input",showSuggestionsUtensils);
searchRecipe.addEventListener("input", getRecipes);
displayRecipes(recipes);

   


    

    