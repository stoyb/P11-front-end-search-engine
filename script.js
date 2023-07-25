                            /* Variables a constants */
import { recipes } from "/recipes.js";
import { recipeCard } from "/recipeCard.js";
import { listOfRecipes, searchRecipe, nbRecipesAll, nbRecipes, lastRecipeId } from "./variables.js";
import { blocIngredients, blocAppliance, blocUtensils } from "./variables.js";
import { ingredientsSearchBar, ingredientsSuggestionsList, applianceSearchBar,
    applianceSuggestionsList, utensilsSearchBar, utensilsSuggestionsList } from "./variables.js";
import { downChevronIngredients, downChevronAppliance, downChevronUtensils,
    upChevronIngredients, upChevronAppliance, upChevronUtensils } from "./variables.js";
import { listOfTags } from "./variables.js";
//Number of recipes in ListOfRecipes
nbRecipesAll.innerHTML = lastRecipeId;
// Create the filtered lists of filters 
let state = {
    ingredients : [],
    appliance : [], 
    utensils : [], 
    keyword : []
}                                 /* Functions */
// Opens a list of tags
function openListOfTags(downChevron, upChevron, blocFilters, searchBar) {
    downChevron.addEventListener('click', () => {
        downChevron.style.display = "none";
        upChevron.style.display = "inline-block";
        blocFilters.style.display = "block";
        searchBar.value = "";
        searchBar.focus();
    })
}
// Closes a list of tags
function closeListOfTags(upChevron, downChevron, blocFilters) {
        upChevron.style.display = "none";
        downChevron.style.display = "inline-block";
        blocFilters.style.display = "none";
        searchRecipe.focus();
}
// Displays number of recipes 
function displayNbOfRecipes(recipes) {
    nbRecipes.innerHTML = " ";
    nbRecipes.innerHTML = recipes.length + " recettes";
    if(recipes.length === 1 ) {
        nbRecipes.innerHTML = " ";
        nbRecipes.innerHTML = 1 + " recette";
    }
}
// Removes the occurrences 
function filterAList(list) {
    const uniqueItems = [...new Set(list)];
    return uniqueItems
}
// Displays all recipes on the website 
function displayRecipes(recipes) {
    if (recipes) {
        for(let i = 0; i < recipes.length; i++){
            const recipe = recipes[i];
            const modelCard = recipeCard(recipe);
            const cardRecipe = modelCard.getRecipeCardDOM();
            listOfRecipes.appendChild(cardRecipe);
        }
    }
}
// Selects recipes asked with their name, their description and their list of ingredients
function selectRecipes(item) {
    const recipesList = [];
    const itemRecipe = item.toLowerCase();
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        const recipeIngredients = recipe.ingredients;
        let nameFounded = false;
        let ingredientsFounded = false;
        let descriptionFounded = false;
        if (recipeName.includes(itemRecipe) || recipeName.includes(" " + itemRecipe + " ") || recipeName.endsWith(itemRecipe)) {
            nameFounded = true;
        }
        for (let j = 0; j < recipeIngredients.length; j++) {
            const ingredient = recipeIngredients[j].ingredient.toLowerCase();
            if (ingredient.startsWith(itemRecipe + " ") || ingredient.includes(" " + itemRecipe + " ") || ingredient.endsWith(itemRecipe)) {
                ingredientsFounded = true;
                break; 
            }
        }
        if (recipeDescription.startsWith(itemRecipe) || recipeDescription.includes(" " + itemRecipe + " ") || recipeDescription.endsWith(itemRecipe)) {
            descriptionFounded = true;
        }
        if (nameFounded || ingredientsFounded || descriptionFounded) {
            recipesList.push(recipe);
        }
    }
    return recipesList;
}
// Gets only recipes which have all words inside state.keyword  
function filterRecipesWithKeyWords(recipesListResults) {
    const filteredListOfRecipes = [];
    for (let i = 0; i < recipesListResults.length; i++) {
        const recipe = recipesListResults[i];
        let isMatching = true;
        for (let j = 0; j < state.keyword.length; j++) {
            const keyword = state.keyword[j].toLowerCase();
            if (
                !recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase().includes(" " + keyword.toLowerCase() + " ") || ingredient.ingredient.toLowerCase().startsWith(keyword.toLowerCase() + " ") || ingredient.ingredient.toLowerCase().endsWith(keyword.toLowerCase())
                ) &&
                !recipe.name.toLowerCase().includes(keyword) &&
                !recipe.description.toLowerCase().includes((" " + keyword)) &&
                !recipe.appliance.toLowerCase().includes( keyword + " ") &&
                !recipe.ustensils.some(item => item.toLowerCase().includes(keyword))
            ) {
                isMatching = false;
                break;
            }
        }
        if (isMatching) {
            filteredListOfRecipes.push(recipe);
        }
    }
    return filteredListOfRecipes;
}

// Changes all the three filters' states 
function changeAllStates(recipes) {
    state.ingredients = filterAList(getUniqueItems(getAllIngredients, state.ingredients, recipes));
    state.appliance = filterAList(getUniqueItems(getAllAppliance, state.appliance, recipes));
    state.utensils = filterAList(getUniqueItems(getAllUtensils, state.utensils, recipes));
}
// Gets and displays recipes asked only with the search bar
function inlineBlockStyleRecipesList() {
    listOfRecipes.classList.remove('list-recipes--grid')
    listOfRecipes.classList.add('list-recipes--inline-block')
}
function gridStyleRecipesList() {
    listOfRecipes.classList.remove('list-recipes--inline-block')
    listOfRecipes.classList.add('list-recipes--grid')
}
let itemBar = [];
function getRecipesWithSearchBar() {
    const searchValue = searchRecipe.value.toLowerCase();
    const listRecipe = selectRecipes(searchValue);
    const recipesResult = filterRecipesWithKeyWords(listRecipe);
    state.keyword = filterAList(state.keyword);
    if (listRecipe.length === 0) {
        listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + searchValue + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
        inlineBlockStyleRecipesList();
        nbRecipes.innerHTML = " ";
        nbRecipes.innerHTML = 0 + " recettes";
    }
    if (listRecipe.length >= 1) {
        listOfRecipes.innerHTML = " ";
        gridStyleRecipesList();
        displayRecipes(filterAList(recipesResult));
        displayNbOfRecipes(filterAList(recipesResult));
    }
    state.ingredients.splice(0, state.ingredients.length);
    state.appliance.splice(0, state.appliance.length);
    state.utensils.splice(0, state.utensils.length);
    changeAllStates(recipesResult)
    if (searchValue.length == 0 && listOfTags.innerHTML === "") {
        updateStates(recipes)
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        displayNbOfRecipes(recipes);
        if (listOfRecipes.style.display == "inline-block") {
            gridStyleRecipesList();
        }
        state.keyword = [];
    }
    if (searchValue.length == 0) {
        changeAllStates(recipesResult)
        listOfRecipes.innerHTML = "";
        displayRecipes(recipesResult);
        displayNbOfRecipes(recipesResult);
        if (listOfRecipes.style.display == "inline-block") {
            gridStyleRecipesList();
        }
        const updatedKeyword = [];
        for (let i = 0; i < state.keyword.length; i++) {
            const keyword = state.keyword[i];
            if (keyword != itemBar[0]) {
                updatedKeyword.push(keyword);
            }
        }
        state.keyword = updatedKeyword;
        itemBar = [];
        listOfRecipes.innerHTML = " ";
        const recipesRes = filterRecipesWithKeyWords(recipes);
        displayRecipes(filterAList(recipesRes));
        displayNbOfRecipes(filterAList(recipesRes));
    } else if (searchValue.length >= 3) { 
        for (let i = 0; i < listRecipe.length; i++) {
            const item = listRecipe[i];
            const itemName = item.name.toLowerCase();
            const itemDescription = item.description.toLowerCase();
            if (
              itemName.includes(" " + searchValue + " ") ||
              itemName.startsWith(searchValue + " ") ||
              itemName.endsWith(searchValue) ||
              itemDescription.includes(" " + searchValue + " ") ||
              itemDescription.startsWith(searchValue + " ") ||
              itemDescription.endsWith(searchValue)
            ) {
              state.keyword.push(searchValue);
              itemBar.push(searchValue);
            }
        }
        for (let i = 0; i < state.ingredients.length; i++) {
            const item = state.ingredients[i];
            const lowerCaseItem = item.toLowerCase();
            if (
              lowerCaseItem.includes(" " + searchValue + " ") ||
              lowerCaseItem.startsWith(searchValue + " ") ||
              lowerCaseItem.endsWith(searchValue)
            ) {
              state.keyword.push(searchValue);
              itemBar.push(searchValue);
            }
        }
    }
    return recipesResult
}
const exportedListSearchBar = getRecipesWithSearchBar();
// Gets all ingredients inside each recipe (with occurrences)
function getAllIngredients(recipes) {
    const ingredientsAll = [];
    if (recipes) {
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const recipeIngredients = recipe.ingredients
            if (recipeIngredients) {
                for(let j = 0; j < recipeIngredients.length; j++) {
                    const ingredient = recipeIngredients[j].ingredient.toLowerCase();
                    ingredientsAll.push(ingredient)
                }
            }
        }
    }
    return ingredientsAll
}
// Gets all appliances inside each recipe (with occurrences)
function getAllAppliance(recipes) {
    const applianceAll = [];
    if(recipes) {
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const recipeAppliance = recipe.appliance.toLowerCase();
            applianceAll.push(recipeAppliance)
        }
    }
    return applianceAll
}
// Gets all utensils inside each recipe (with occurrences)
function getAllUtensils(recipes) {
    const utensilsAll = [];
    if(recipes) {
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const recipeUtensils = recipe.ustensils
            if(recipeUtensils) {
                for(let j = 0; j < recipeUtensils.length; j++) {
                    const item = recipeUtensils[j].toLowerCase();
                    utensilsAll.push(item);
                }
            }
        }
    }
    return utensilsAll
}
// Generates the three filters lists without occurrences 
function getUniqueItems(getAFilter, dataList, recipes) {
    const itemsList = getAFilter(recipes);
    const filteredList = filterAList(itemsList);
    for (let i = 0; i < filteredList.length; i++) {
        const recipe = filteredList[i];
        dataList.push(recipe)
    }
    return dataList
}
//Pull out all words inside state.keyword
function filterStateProperty(property, keyword) {
    const filteredProperty = [];
    for (let i = 0; i < property.length; i++) {
        const element = property[i];
        let includeKeyword = true;
        for (let j = 0; j < keyword.length; j++) {
            const item = keyword[j];
            if (element.toLowerCase().includes(item.toLowerCase())) {
                includeKeyword = false;
                break;
            }
        }
        if (includeKeyword) {
            filteredProperty.push(element);
        }
    }
    return filteredProperty;
}
// Generates new datalists filters
function updateStates(filtersList) {
    closeListOfTags(upChevronIngredients, downChevronIngredients, blocIngredients);
    closeListOfTags(upChevronAppliance, downChevronAppliance, blocAppliance);
    closeListOfTags(upChevronUtensils, downChevronUtensils, blocUtensils);
    ingredientsSuggestionsList.innerHTML = " ";
    applianceSuggestionsList.innerHTML = " ";
    utensilsSuggestionsList.innerHTML = " ";  
    state.ingredients = filterAList(getAllIngredients(filtersList));
    state.appliance = filterAList(getAllAppliance(filtersList));
    state.utensils = filterAList(getAllUtensils(filtersList));
    state.ingredients = filterStateProperty(state.ingredients, state.keyword);
    state.appliance = filterStateProperty(state.appliance, state.keyword);
    state.utensils = filterStateProperty(state.utensils, state.keyword);
}
// Creates a tag and changes the three datalists' content and recipes list's content
function createATag(item) {
    const searchValue = searchRecipe.value.toLowerCase();
    const tagASuggestion = document.createElement('p');
    tagASuggestion.classList.add("filter-button");
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
        state.keyword = state.keyword.filter((keyword) => {
            return !keyword.toLowerCase().includes(item.toLowerCase());
        });
        const recipeList = filterRecipesWithKeyWords(exportedListSearchBar);
        updateStates(recipeList);
        listOfRecipes.innerHTML = "";
        displayRecipes(recipeList);
        displayNbOfRecipes(filterAList(recipeList));
        if (searchValue.length >= 3 || listOfTags.innerHTML === "") {
            const listRecipe = selectRecipes(searchValue);
            const recipesResult = filterRecipesWithKeyWords(listRecipe);
            updateStates(recipesResult);
            listOfRecipes.innerHTML = "";
            displayRecipes(filterAList(recipesResult));
            displayNbOfRecipes(filterAList(recipesResult));
        }
        if (state.keyword.length === 0) {
            updateStates(recipes);
            listOfRecipes.innerHTML = "";
            displayRecipes(recipes);
            displayNbOfRecipes(recipes);
        }
    });
    const listRecipe = selectRecipes(searchValue);
    const recipeList = filterRecipesWithKeyWords(listRecipe);
    updateStates(recipeList);
    listOfRecipes.innerHTML = "";
    displayRecipes(recipeList);
    displayNbOfRecipes(filterAList(recipeList));
}
// Executes createATag function with the click on a suggestion
function clickOnASuggestion(option, item) {
    option.addEventListener('click', function() {
        createATag(item)
    });
}
// Displays a datalist for each filter
function displayDatalist(stateFilters, searchBar, suggestionsList) {
    const searchValue = searchBar.value.toLowerCase();
    suggestionsList.innerHTML = "";
    function createOptionAndAddClickEvent(item) {
        const option = document.createElement("li");
        option.classList.add("li-filters");
        option.textContent = item;
        suggestionsList.appendChild(option);
        clickOnASuggestion(option, item);
    }
    if (searchValue.length === 0) {
        suggestionsList.innerHTML = "";
        for(let i = 0; i < stateFilters.length; i++) {
            createOptionAndAddClickEvent(stateFilters[i]);
        } 
    } else if (searchValue.length >= 1) {
        const suggestions = [];
        for (let i = 0; i < stateFilters.length; i++) {
            const item = stateFilters[i];
            if (item.toLowerCase().startsWith(searchValue) || item.toLowerCase().includes(" " + searchValue) || item.toLowerCase().endsWith(searchValue + " ")) {
                suggestions.push(item);
            }
        }
        for (let i = 0; i < suggestions.length; i++) {
            createOptionAndAddClickEvent(suggestions[i]);
        }
    }
}   
// Adds input and focus event listeners for tags bars 
function addInputAndFocusEventListeners(searchBar) {
    searchBar.addEventListener("input", function () {
        displayDatalist(state.ingredients, ingredientsSearchBar, ingredientsSuggestionsList)
        displayDatalist(state.appliance,  applianceSearchBar, applianceSuggestionsList)
        displayDatalist(state.utensils, utensilsSearchBar, utensilsSuggestionsList)

    });
    searchBar.addEventListener("focus", function () {
        displayDatalist(state.ingredients, ingredientsSearchBar, ingredientsSuggestionsList)
        displayDatalist(state.appliance,  applianceSearchBar, applianceSuggestionsList)
        displayDatalist(state.utensils, utensilsSearchBar, utensilsSuggestionsList)
    });
} 
                                /* Calls of functionn */
openListOfTags(downChevronIngredients, upChevronIngredients, blocIngredients, ingredientsSearchBar);
openListOfTags(downChevronAppliance, upChevronAppliance, blocAppliance, applianceSearchBar);
openListOfTags(downChevronUtensils, upChevronUtensils, blocUtensils, utensilsSearchBar);
upChevronIngredients.addEventListener('click', () => {
    closeListOfTags(upChevronIngredients, downChevronIngredients, blocIngredients)
});
upChevronAppliance.addEventListener('click', () => {
    closeListOfTags(upChevronAppliance, downChevronAppliance, blocAppliance)
})
upChevronUtensils.addEventListener('click', () => {
    closeListOfTags(upChevronUtensils, downChevronUtensils, blocUtensils);
});
changeAllStates(recipes)
addInputAndFocusEventListeners(ingredientsSearchBar);
addInputAndFocusEventListeners(applianceSearchBar);
addInputAndFocusEventListeners(utensilsSearchBar);
searchRecipe.addEventListener("input", getRecipesWithSearchBar);
displayRecipes(recipes);
displayNbOfRecipes(recipes);