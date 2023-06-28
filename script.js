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

// Function to remove the occurrences 
function filterAllList(list) {
    const uniqueItems = [...new Set(list)];
    return uniqueItems
}

function displayRecipes(recipes) {
    recipes.forEach((recipe)=> {
        const modelCard = recipeFactory(recipe);
        const cardRecipe = modelCard.getRecipeCardDOM();
        listOfRecipes.appendChild(cardRecipe);
    })
}

function allIng(item) {
    const suggestionsName = recipes.filter(element =>
        element.name.toLowerCase().includes(" " + item + " ") || element.name.toLowerCase().endsWith(item + " ")
    );
    const suggestionsDescription = recipes.filter(element =>
        element.description.toLowerCase().startsWith(item) || element.description.toLowerCase().includes(" " + item + " ") || element.description.toLowerCase().endsWith(item + " ")
    );
    const suggestionsIngredients = recipes.filter(element =>
        element.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(item)
        )
    );
    const allSuggestions = [
        ...suggestionsName,
        ...suggestionsDescription,
        ...suggestionsIngredients
    ];
    return allSuggestions
} 

function changeState(recipes) {
    state.ingredients = getUniqueItems(getAllIngredients, dataIngredients, recipes);
    state.appliance = getUniqueItems(getAllAppliance, dataAppliance, recipes);
    state.utensils = getUniqueItems(getAllUtensils, dataUtensils, recipes);
}

function getRecipes() {
    const valeurRecherche = searchRecipe.value.toLowerCase();
    state.keyword = filterAllList(state.keyword);
    const listRecipe = allIng(valeurRecherche);
    if (listRecipe.length === 0) {
      listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + valeurRecherche + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
      listOfRecipes.style.display = "inline-block";
    }
    if (listRecipe.length >= 1) {
        listOfRecipes.innerHTML = " ";
        displayRecipes(filterAllList(listRecipe));
    }
    state.ingredients.splice(0, state.ingredients.length);
    state.appliance.splice(0, state.appliance.length);
    state.utensils.splice(0, state.utensils.length);
    changeState(listRecipe);
    const filterListrecipes = filterAllList(listRecipe);
    if (valeurRecherche.length == 0) {
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        if (listOfRecipes.style.display == "inline-block") {
            listOfRecipes.style.display = "grid";
            displayRecipes(recipes);
        }
        state.keyword = state.keyword.filter((item) => {
            changeState(recipes)
            return state.ingredients.includes(item) || state.appliance.includes(item) || state.utensils.includes(item);
        });
        state.keyword.forEach((item)=> {
            const allSuggestions = allIng(item);
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAllList(allSuggestions));
        })
      } else if (valeurRecherche.length >= 3) {
        state.ingredients.forEach((item) => {
            if (item.toLowerCase().includes(valeurRecherche) && item.toLowerCase().endsWith(valeurRecherche)) {
                state.keyword.push(valeurRecherche);
            }
        });
    }
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

// Factorized function to generate the three filteredLists without occurrences 
function getUniqueItems(getAFilter, dataList, recipes){
    const itemsList = getAFilter(recipes);
    const filteredList = filterAllList(itemsList);
    filteredList.forEach((item) => {
        dataList.push(item);
    })
    return dataList
}

function allKey() {
    const exportedRecipes = getRecipes();
    const suggIngredients = exportedRecipes.filter((recipe) =>
        state.keyword.every((keyword) =>
            recipe.ingredients.some((ingredient) =>
                ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
            ) ||
            recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.appliance.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.ustensils.some((item) =>
                item.toLowerCase().includes(keyword.toLowerCase())
            )
        )
    );
    return suggIngredients
}

function upDateState(suggIngredients) {
    listeSuggestionsIngredients.innerHTML = " ";
    listeSuggestionsAppliance.innerHTML = " ";
    listeSuggestionsUtensils.innerHTML = " ";  
    state.ingredients = filterAllList(getAllIngredients(suggIngredients));
    state.appliance = filterAllList(getAllAppliance(suggIngredients));
    state.utensils = filterAllList(getAllUtensils(suggIngredients));
}

function factorisedRecipes(filterButtonClass, item, state){
    const filterButton = document.createElement('p');
    filterButton.classList.add(filterButtonClass);
    filterButton.textContent = item;
    const closeButton = document.createElement("span");
    const closeButtonIcon = document.createElement('i');
    closeButtonIcon.classList.add("fa", "fa-circle-xmark");
    closeButton.appendChild(closeButtonIcon);
    filterButton.appendChild(closeButton);
    listFilters.appendChild(filterButton);
    state.keyword.push(item);
    closeButton.addEventListener('click', function() {
        filterButton.remove();
        state.keyword = state.keyword.filter((keyword)=> {
            return !keyword.toLowerCase().includes(item);
        });
        if (state.keyword.length >= 1 || listFilters.innerHTML == 0) {
            let recipeList = allKey();  
            upDateState(recipeList);
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAllList(recipeList));
        }
        if (state.keyword.length === 0) {
            upDateState(recipes);
            listOfRecipes.innerHTML = " ";
            displayRecipes(recipes);
        }
    })
    const suggestions = allKey();
    upDateState(suggestions);
    state = state.filter((element) =>
        state.keyword.every((keyword) =>
            !element.toLowerCase().includes(keyword.toLowerCase()) 
    ));
    listOfRecipes.innerHTML = " ";
    displayRecipes(suggestions);
}

function recipeWithFilter(option, item, filterButtonClass, state) {
    option.addEventListener('click', function() {
        factorisedRecipes(filterButtonClass, item, state)
    });
}

changeState(recipes)

function stateFilters(stateSugguestions, filterButtonClass, state) {
    stateSugguestions.forEach((item) => {
        const option = document.createElement("li");
        option.classList.add("li-filters");
        option.textContent = item;
        listeSuggestionsIngredients.appendChild(option);
        recipeWithFilter(option, item, filterButtonClass, state)
    });
}

function showSuggestionsFilters(state, filterButtonClass) {
    const valeurRecherche = champRechercheIngredients.value.toLowerCase();
    listeSuggestionsIngredients.innerHTML = "";
    if (valeurRecherche.length == 0) {
        stateFilters(state, filterButtonClass, state)
    }
    if (valeurRecherche.length >= 1) {
        const suggestions = state.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche) || item.toLowerCase().includes(" " + valeurRecherche) || item.toLowerCase().endsWith(valeurRecherche + " ")
        );
        stateFilters(suggestions, filterButtonClass, state)
    }
}

champRechercheIngredients.addEventListener("input",function (){
    showSuggestionsFilters(state.ingredients, 'filter-button__ingredients')
});
champRechercheAppliance.addEventListener("input",function (){
    showSuggestionsFilters(state.appliance, 'filter-button__appliance')
});
champRechercheUtensils.addEventListener("input",function (){
    showSuggestionsFilters(state.utensils, 'filter-button__utensils')
});
searchRecipe.addEventListener("input", getRecipes);
displayRecipes(recipes);