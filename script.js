                            /* Variables and constants */
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
}
                                    /* Functions */

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
// Displays all recipes on the website -- boucle for
function displayRecipes(recipes) {
    recipes.forEach((recipe)=> {
        const modelCard = recipeCard(recipe);
        const cardRecipe = modelCard.getRecipeCardDOM();
        listOfRecipes.appendChild(cardRecipe);
    })
}
// Selects recipes asked with their name, their description and their list of ingredients
function selectRecipes(item) {
    const itemRecipe = item.toLowerCase();
    const filteredRecipes = recipes.filter(element =>
        element.name.toLowerCase().startsWith(itemRecipe) || element.name.toLowerCase().includes(itemRecipe) || element.name.toLowerCase().includes(" " + itemRecipe + " ") || element.name.toLowerCase().endsWith(itemRecipe + " ")
    ).concat(
        recipes.filter(element =>
            element.description.toLowerCase().startsWith(itemRecipe) || element.description.toLowerCase().includes(" " + itemRecipe + " ") || element.description.toLowerCase().endsWith(itemRecipe)
        )
    ).concat(
        recipes.filter(element =>
            element.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase().startsWith(itemRecipe + " ") || ingredient.ingredient.toLowerCase().includes(" " + itemRecipe + " ") || ingredient.ingredient.toLowerCase().endsWith(itemRecipe)
            )
        )
    );
    return filteredRecipes;
}
function filterRecipesWithKeyWords(recipesListResults) {
    return recipesListResults.filter(recipe => {
        return state.keyword.every(keyword => {
            const lowerCaseKeyword = keyword.toLowerCase();
            return (
                recipe.ingredients.some(ingredient =>
                    ingredient.ingredient.toLowerCase().includes(" " + lowerCaseKeyword + " ") ||
                    ingredient.ingredient.toLowerCase().startsWith(lowerCaseKeyword + " ") ||
                    ingredient.ingredient.toLowerCase().endsWith(lowerCaseKeyword)
                ) ||
                recipe.name.toLowerCase().includes(lowerCaseKeyword) ||
                recipe.description.toLowerCase().includes(" " + lowerCaseKeyword) ||
                recipe.appliance.toLowerCase().includes(lowerCaseKeyword) ||
                recipe.ustensils.some(item => item.toLowerCase().includes(lowerCaseKeyword))
            );
        });
    });
}

// Changes all the three filters' states 
function changeAllStates(recipes) {
    state.ingredients = getUniqueItems(getAllIngredients, state.ingredients, recipes);
    state.appliance = getUniqueItems(getAllAppliance, state.appliance, recipes);
    state.utensils = getUniqueItems(getAllUtensils, state.utensils, recipes);
}
// Gets and displays recipes asked only with the search bar
function inlineBlockStyleRecipesList() {
    listOfRecipes.classList.remove('list-recipes')
    listOfRecipes.classList.add('list-recipes--inline-block')
}
function gridStyleRecipesList() {
    listOfRecipes.classList.remove('list-recipes--inline-block')
    listOfRecipes.classList.add('list-recipes')
}
let itemBar = [];
function getRecipesWithSearchBar() {
    const searchValue = searchRecipe.value.toLowerCase();
    const listRecipe = selectRecipes(searchValue);

    const recipesResult = filterRecipesWithKeyWords(listRecipe);
    state.keyword = filterAList(state.keyword);
    if (recipesResult.length === 0) {
      listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + searchValue + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
      inlineBlockStyleRecipesList();
      nbRecipes.innerHTML = " ";
      nbRecipes.innerHTML = 0 + " recettes";
    }
    if (recipesResult.length >= 1) {
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
        changeAllStates(recipes)
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        displayNbOfRecipes(recipes);
        if (listOfRecipes.className == "list-recipes--inline-block") {
            gridStyleRecipesList();
        }
        state.keyword = [];
    }
    if (searchValue.length == 0) {
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        displayNbOfRecipes(recipes);
        if (listOfRecipes.className == "list-recipes--inline-block") {
            gridStyleRecipesList();
        }
        state.keyword = state.keyword.filter((item) => {
            return item != itemBar[0]
        });
        itemBar = [];
        listOfRecipes.innerHTML = " ";
        const recipesRes = filterRecipesWithKeyWords(recipes);
        displayRecipes(filterAList(recipesRes));
        displayNbOfRecipes(filterAList(recipesRes));
        } else if (searchValue.length >= 3) {
        listRecipe.forEach((item) => {
            const itemName = item.name.toLowerCase();
            const itemDescription = item.description.toLowerCase();
            if (itemName.includes(" " + searchValue + " ") || itemName.startsWith(searchValue + " ") || itemName.endsWith(searchValue) ||
              itemDescription.includes(" " + searchValue + " ") || itemDescription.startsWith(searchValue + " ") || itemDescription.endsWith(searchValue)
              ) {
              state.keyword.push(searchValue);
              itemBar.push(searchValue);
            }
        });
        state.ingredients.forEach((item) => {
            if (item.toLowerCase().includes(" "  + searchValue + " ") || item.toLowerCase().startsWith(searchValue + " ") || item.toLowerCase().endsWith(searchValue)) {
                state.keyword.push(searchValue);
                itemBar.push(searchValue);
            }
        });
    }
    return recipesResult
}
const exportedListSearchBar = getRecipesWithSearchBar();
// Gets all ingredients inside each recipe (with occurrences)
function getAllIngredients(recipes) {
    const ingredientsAll = [];
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsAll.push(ingredient.ingredient.toLowerCase());
        });
    });
    return ingredientsAll;
}
// Gets all appliances inside each recipe (with occurrences)
function getAllAppliance(recipes) {
    const applianceAll = [];
    recipes.forEach(recipe => {
        applianceAll.push(recipe.appliance.toLowerCase());
    });
    return applianceAll;
}
// Gets all utensils inside each recipe (with occurrences)
function getAllUtensils(recipes) {
    const utensilsAll = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((item) => {
            utensilsAll.push(item.toLowerCase());
        });
    });
    return utensilsAll;
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
//Pull out all words inside state.keyword
function filterStateProperty(property, keyword) {
    return property.filter((element) => {
        return keyword.every((item) => {
            return !element.toLowerCase().includes(item.toLowerCase());
        });
    });
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
    tagASuggestion.classList.add('filter-button');
    tagASuggestion.textContent = item;
    const closeTagButton = document.createElement("span");
    const closeTagButtonIcon = document.createElement('i');
    closeTagButtonIcon.classList.add("fa", "fa-xmark");
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
    displayRecipes(filterAList(recipeList));
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
      stateFilters.forEach(createOptionAndAddClickEvent);
    } else if (searchValue.length >= 1) {
      const suggestions = stateFilters.filter((item) =>
        item.toLowerCase().startsWith(searchValue) || item.toLowerCase().includes(" " + searchValue) || item.toLowerCase().endsWith(searchValue + " ")
      );
      suggestions.forEach(createOptionAndAddClickEvent);
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
                                /* Calls of functions */
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