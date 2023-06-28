                            /* Variables et constants */
import { recipes } from "/recipes.js";
import { recipeFactory } from "/recipeCard.js";
const ingredientsSearchBar = document.querySelector("#bloc-ingredients__input");
const ingredientsSuggestionsList = document.querySelector("#bloc-ingredients__list");
const applianceSearchBar = document.querySelector("#bloc-appliance__input");
const applianceSuggestionsList = document.querySelector("#bloc-appliance__list");
const utensilsSearchBar = document.querySelector("#bloc-utensils__input");
const utensilsSuggestionsList = document.querySelector("#bloc-utensils__list");
const listOfRecipes = document.querySelector(".list-recipes");
const searchRecipe = document.querySelector("#search-recipe___input");
const listOfTags = document.querySelector('.list-tags');
let dataIngredients = []; 
let dataAppliance = [];
let dataUtensils = [];
                                    /* Functions */
// Create the filtered lists of filters 
let state = { 
    ingredients : dataIngredients,
    appliance : dataAppliance, 
    utensils : dataUtensils, 
    keyword : []
}
// Function to remove the occurrences 
function filterAList(list) {
    const uniqueItems = [...new Set(list)];
    return uniqueItems
}
// Displays all recipes on the website
function displayRecipes(recipes) {
    recipes.forEach((recipe)=> {
        const modelCard = recipeFactory(recipe);
        const cardRecipe = modelCard.getRecipeCardDOM();
        listOfRecipes.appendChild(cardRecipe);
    })
}
// Selects recipes asked with their name, their description and their list of ingredients
function selectRecipes(item) {
    const recipesByName = recipes.filter(element =>
        element.name.toLowerCase().includes(" " + item + " ") || element.name.toLowerCase().endsWith(item + " ")
    );
    const recipesByDescription = recipes.filter(element =>
        element.description.toLowerCase().startsWith(item) || element.description.toLowerCase().includes(" " + item + " ") || element.description.toLowerCase().endsWith(item + " ")
    );
    const recipesByIngredients = recipes.filter(element =>
        element.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(item)
        )
    );
    const recipesList = [
        ...recipesByName,
        ...recipesByDescription,
        ...recipesByIngredients
    ];
    return recipesList
} 
// Changes all the three filters' states 
function changeAllStates(recipes) {
    state.ingredients = getUniqueItems(getAllIngredients, dataIngredients, recipes);
    state.appliance = getUniqueItems(getAllAppliance, dataAppliance, recipes);
    state.utensils = getUniqueItems(getAllUtensils, dataUtensils, recipes);
}
// Gets and displays recipes asked only with the search bar
function getRecipesWithSearchBar() {
    const searchValue = searchRecipe.value.toLowerCase();
    state.keyword = filterAList(state.keyword);
    const listRecipe = selectRecipes(searchValue);
    if (listRecipe.length === 0) {
      listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + searchValue + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
      listOfRecipes.style.display = "inline-block";
    }
    if (listRecipe.length >= 1) {
        listOfRecipes.innerHTML = " ";
        displayRecipes(filterAList(listRecipe));
    }
    state.ingredients.splice(0, state.ingredients.length);
    state.appliance.splice(0, state.appliance.length);
    state.utensils.splice(0, state.utensils.length);
    changeAllStates(listRecipe);
    const filteredRecipesList = filterAList(listRecipe);
    if (searchValue.length == 0) {
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        if (listOfRecipes.style.display == "inline-block") {
            listOfRecipes.style.display = "grid";
            displayRecipes(recipes);
        }
        state.keyword = state.keyword.filter((item) => {
            changeAllStates(recipes)
            return state.ingredients.includes(item) || state.appliance.includes(item) || state.utensils.includes(item);
        });
        state.keyword.forEach((item)=> {
            const recipesList = selectRecipes(item);
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAList(recipesList));
        })
      } else if (searchValue.length >= 3) {
        state.ingredients.forEach((item) => {
            if (item.toLowerCase().includes(searchValue) && item.toLowerCase().endsWith(searchValue)) {
                state.keyword.push(searchValue);
            }
        });
    }
    return filteredRecipesList;
}
// Gets all ingredients inside each recipe (with occurrences)
function getAllIngredients(recipes) {
    const allIngredients = [];
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            allIngredients.push(ingredient.ingredient.toLowerCase());
        });
    }); 
    return allIngredients;
}
// Gets all appliance inside each recipe (with occurrences)
function getAllAppliance(recipes) {
    const allAppliance = [];
    recipes.forEach(recipe => {
        allAppliance.push(recipe.appliance.toLowerCase());
    });
    return allAppliance;
}
// Gets all utensils inside each recipe (with occurrences)
function getAllUtensils(recipes) {
    const allUtensils = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((item) => {
            allUtensils.push(item.toLowerCase());
        });
    });
    return allUtensils;
}
// Generates the three filters lists without occurrences 
function getUniqueItems(getAFilter, dataList, recipes){
    const itemsList = getAFilter(recipes);
    const filteredList = filterAList(itemsList);
    filteredList.forEach((item) => {
        dataList.push(item);
    })
    return dataList
}
// Gets only recipes which have all words inside state.keyword  
function filterRecipesWithKeyWords() {
    const exportedRecipes = getRecipesWithSearchBar();
    const filteredListOfRecipes = exportedRecipes.filter((recipe) =>
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
    return filteredListOfRecipes
}
// Generates new datalists filters 
function updateStates(filtersList) {
    ingredientsSuggestionsList.innerHTML = " ";
    applianceSuggestionsList.innerHTML = " ";
    utensilsSuggestionsList.innerHTML = " ";  
    state.ingredients = filterAList(getAllIngredients(filtersList));
    state.appliance = filterAList(getAllAppliance(filtersList));
    state.utensils = filterAList(getAllUtensils(filtersList));
}
// Creates a tag and changes the three datalists' content and recipes list's content
function createATag(filterButtonClass, item, state){
    const tagASuggestion = document.createElement('p');
    tagASuggestion.classList.add(filterButtonClass);
    tagASuggestion.textContent = item;
    const closeTagButton = document.createElement("span");
    const closeTagButtonIcon = document.createElement('i');
    closeTagButtonIcon.classList.add("fa", "fa-circle-xmark");
    closeTagButton.appendChild(closeTagButtonIcon);
    tagASuggestion.appendChild(closeTagButton);
    listOfTags.appendChild(tagASuggestion);
    state.keyword.push(item);
    closeTagButton.addEventListener('click', function() {
        tagASuggestion.remove();
        state.keyword = state.keyword.filter((keyword)=> {
            return !keyword.toLowerCase().includes(item);
        });
        if (state.keyword.length >= 1 || listOfTags.innerHTML == 0) {
            let recipeList = filterRecipesWithKeyWords();  
            updateStates(recipeList);
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAList(recipeList));
        }
        if (state.keyword.length === 0) {
            updateStates(recipes);
            listOfRecipes.innerHTML = " ";
            displayRecipes(recipes);
        }
    })
    const recipeList = filterRecipesWithKeyWords();
    updateStates(recipeList);
    state = state.filter((element) =>
        state.keyword.every((keyword) =>
            !element.toLowerCase().includes(keyword.toLowerCase()) 
    ));
    listOfRecipes.innerHTML = " ";
    displayRecipes(recipeList);
}
// Executes createATag function with the click on a suggestion
function clickOnASuggestion(option, item, filterButtonClass, state) {
    option.addEventListener('click', function() {
        createATag(filterButtonClass, item, state)
    });
}
// Creates a suggestion on a datalist
function createASuggestion(stateSugguestions, filterButtonClass, state, suggestionsList) {
    stateSugguestions.forEach((item) => {
        const option = document.createElement("li");
        option.classList.add("li-filters");
        option.textContent = item;
        suggestionsList.appendChild(option);
        clickOnASuggestion(option, item, filterButtonClass, state)
    });
}
// Displays a datalist for each filter
function displayDatalist(state, filterButtonClass, suggestionsList) {
    const searchValue = suggestionsList.value.toLowerCase();
    suggestionsList.innerHTML = "";
    if (searchValue.length == 0) {
        createASuggestion(state, filterButtonClass, state, suggestionsList)
    }
    if (searchValue.length >= 1) {
        const suggestions = state.filter(item =>
            item.toLowerCase().startsWith(searchValue) || item.toLowerCase().includes(" " + searchValue) || item.toLowerCase().endsWith(searchValue + " ")
            );
            createASuggestion(suggestions, filterButtonClass, state, suggestionsList)
    }
}
                            /* Calls of functionn */
changeAllStates(recipes)
ingredientsSearchBar.addEventListener("input",function (){
    displayDatalist(state.ingredients, 'filter-button__ingredients', ingredientsSuggestionsList)
});
applianceSearchBar.addEventListener("input",function (){
    displayDatalist(state.appliance, 'filter-button__appliance', applianceSuggestionsList)
});
utensilsSearchBar.addEventListener("input",function (){
    displayDatalist(state.utensils, 'filter-button__utensils', utensilsSuggestionsList)
});
searchRecipe.addEventListener("input", getRecipesWithSearchBar);
displayRecipes(recipes);