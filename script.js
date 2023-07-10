                            /* Variables a constants */
import { recipes } from "/recipes.js";
import { recipeCard } from "/recipeCard.js";
const ingredientsSearchBar = document.querySelector("#bloc-ingredients__input");
const ingredientsSuggestionsList = document.querySelector("#bloc-ingredients__list");
const applianceSearchBar = document.querySelector("#bloc-appliance__input");
const applianceSuggestionsList = document.querySelector("#bloc-appliance__list");
const utensilsSearchBar = document.querySelector("#bloc-utensils__input");
const utensilsSuggestionsList = document.querySelector("#bloc-utensils__list");
const listOfRecipes = document.querySelector(".list-recipes");
const searchRecipe = document.querySelector("#search-recipe___input");
const listOfTags = document.querySelector('#list-tags');
const nbRecipesAll = document.querySelector('#nb-recipes-all');
const nbRecipes = document.querySelector('#nb-recipes__paragraph');
const lastRecipeId  = recipes[recipes.length - 1].id;
const downChevronIngredients = document.querySelector('#input-ingredients__chevron-down');
const downChevronAppliance = document.querySelector('#input-appliance__chevron-down');
const downChevronUtensils = document.querySelector('#input-utensils__chevron-down');
const blocIngredients = document.querySelector("#bloc-ingredients");
const blocAppliance = document.querySelector("#bloc-appliance");
const blocUtensils = document.querySelector("#bloc-utensils");
const upChevronIngredients = document.querySelector('#input-ingredients__chevron-up');
const upChevronAppliance = document.querySelector('#input-appliance__chevron-up');
const upChevronUtensils = document.querySelector('#input-utensils__chevron-up');
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
function openListOfTags(downChevron, upChevron, blocFilters) {
    downChevron.addEventListener('click', () => {
        downChevron.style.display = "none";
        upChevron.style.display = "inline-block";
        blocFilters.style.display = "block";
    })
}
// Closes a list of tags
function closeListOfTags(upChevron, downChevron, blocFilters) {
    upChevron.addEventListener('click', () => {
        upChevron.style.display = "none";
        downChevron.style.display = "inline-block";
        blocFilters.style.display = "none";
    })
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
    const suggestionsName = [];
    const suggestionsDescription = [];
    const suggestionsIngredients = [];
    const searchValue = item.toLowerCase();
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeName = recipe.name.toLowerCase();
        const itemRecipe = searchValue;
        if(recipeName.includes(" " + itemRecipe + " ") || recipeName.endsWith(itemRecipe)) {
            suggestionsName.push(recipe);
        }
    }
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeDescription = recipe.description.toLowerCase();
        const itemRecipe = searchValue;
        if(recipeDescription.includes(" " + itemRecipe + " ") || recipeDescription.endsWith(itemRecipe)) {
            suggestionsDescription.push(recipe);
        }
    }
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeIngredients = recipe.ingredients;
        const itemRecipe = searchValue;
        for(let j = 0; j < recipeIngredients.length; j++) {
            const ingredient = recipeIngredients[j].ingredient.toLowerCase();
            if(ingredient.includes(" " + itemRecipe + " ") || ingredient.endsWith(itemRecipe + " ")) {
                suggestionsIngredients.push(recipe);
                break;
            }
        }
    }
    const recipesList = [
        ...suggestionsName,
        ...suggestionsDescription,
        ...suggestionsIngredients
    ];
    return recipesList
} 
// Changes all the three filters' states 
function changeAllStates(recipes) {
    state.ingredients = filterAList(getUniqueItems(getAllIngredients, state.ingredients, recipes));
    state.appliance = filterAList(getUniqueItems(getAllAppliance, state.appliance, recipes));
    state.utensils = filterAList(getUniqueItems(getAllUtensils, state.utensils, recipes));
}
// Gets and displays recipes asked only with the search bar
function getRecipesWithSearchBar() {
    const searchValue = searchRecipe.value.toLowerCase();
    state.keyword = filterAList(state.keyword);
    const listRecipe = selectRecipes(searchValue);
    if (listRecipe.length === 0) {
        listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + searchValue + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
        listOfRecipes.style.display = "inline-block";
        nbRecipes.innerHTML = " ";
        nbRecipes.innerHTML = 0 + " recettes";
    }
    if (listRecipe.length >= 1) {
        listOfRecipes.innerHTML = " ";
        listOfRecipes.style.display = "grid";
        displayRecipes(filterAList(listRecipe));
        displayNbOfRecipes(filterAList(listRecipe));
    }
    state.ingredients.splice(0, state.ingredients.length);
    state.appliance.splice(0, state.appliance.length);
    state.utensils.splice(0, state.utensils.length);
    changeAllStates(listRecipe)
    const filterListrecipes = filterAList(listRecipe);
    if (searchValue.length == 0) {
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        displayNbOfRecipes(recipes);
        if (listOfRecipes.style.display == "inline-block") {
            listOfRecipes.style.display = "grid";
            displayRecipes(recipes);
            displayNbOfRecipes(recipes);
        }
        const filteredKeywords = [];
        for(let i = 0; i < state.keyword.length; i++) {
            const item = state.keyword[i];
            changeAllStates(recipes)
            if (state.ingredients.includes(item) || state.appliance.includes(item) || state.utensils.includes(item)) {
                filteredKeywords.push(item);
              }
        }
        state.keyword = filteredKeywords;
        for(let i = 0; i < state.keyword.length; i++) {
            const item = state.keyword[i];
            changeAllStates(recipes)
            if (state.ingredients.includes(item) || state.appliance.includes(item) || state.utensils.includes(item)) {
                filteredKeywords.push(item);
            }
        }
        for(let i = 0; i < state.keyword.length; i++) {
            const item = state.keyword[i];
            const recipesList = selectRecipes(item);
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAList(recipesList));
        }
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
            }
        }  
    }
    return filterListrecipes;
}
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
// Gets only recipes which have all words inside state.keyword  
function filterRecipesWithKeyWords() {
    const exportedRecipes = getRecipesWithSearchBar();
    const filteredListOfRecipes = [];
    for (let i = 0; i < exportedRecipes.length; i++) {
        const recipe = exportedRecipes[i];
        let isMatching = true;
        for (let i = 0; i < state.keyword.length; i++) {
            const keyword = state.keyword[i];
            if (!recipe.ingredients.some((ingredient) =>
                    ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
                ) &&
                !recipe.description.toLowerCase().includes(keyword.toLowerCase()) &&
                !recipe.appliance.toLowerCase().includes(keyword.toLowerCase()) &&
                !recipe.ustensils.some((item) =>
                    item.toLowerCase().includes(keyword.toLowerCase())
                )
            ) {
                isMatching = false;
                break;
            }
        }
        if (isMatching) {
            filteredListOfRecipes.push(recipe);
        }
    }
    return filteredListOfRecipes
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
function createATag(filterButtonClass, item) {
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
        state.keyword = state.keyword.filter((keyword) => {
            return !keyword.toLowerCase().includes(item.toLowerCase());
        });
        if (state.keyword.length >= 1 || listOfTags.innerHTML === "") {
            let recipeList = filterRecipesWithKeyWords();
            updateStates(recipeList);
            listOfRecipes.innerHTML = "";
            displayRecipes(filterAList(recipeList));
            displayNbOfRecipes(filterAList(recipeList));
        }
        if (state.keyword.length === 0) {
            updateStates(recipes);
            listOfRecipes.innerHTML = "";
            displayRecipes(recipes);
            displayNbOfRecipes(recipes);
        }
    });
    const recipeList = filterRecipesWithKeyWords();
    updateStates(recipeList);
    listOfRecipes.innerHTML = "";
    displayRecipes(recipeList);
    displayNbOfRecipes(filterAList(recipeList));
}
// Executes createATag function with the click on a suggestion
function clickOnASuggestion(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
        createATag(filterButtonClass, item)
    });
}
// Displays a datalist for each filter
function displayDatalist(filterButtonClass, stateFilters, searchBar, suggestionsList) {
    const searchValue = searchBar.value.toLowerCase();
    suggestionsList.innerHTML = "";
    function createOptionAndAddClickEvent(item) {
        const option = document.createElement("li");
        option.classList.add("li-filters");
        option.textContent = item;
        suggestionsList.appendChild(option);
        clickOnASuggestion(option, item, filterButtonClass);
    }
    if (searchValue.length === 0) {
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
                                /* Calls of functionn */
openListOfTags(downChevronIngredients, upChevronIngredients, blocIngredients);
openListOfTags(downChevronAppliance, upChevronAppliance, blocAppliance);
openListOfTags(downChevronUtensils, upChevronUtensils, blocUtensils);
closeListOfTags(upChevronIngredients, downChevronIngredients, blocIngredients);
closeListOfTags(upChevronAppliance, downChevronAppliance, blocAppliance);
closeListOfTags(upChevronUtensils, downChevronUtensils, blocUtensils);
changeAllStates(recipes)
ingredientsSearchBar.addEventListener("input",function (){
    displayDatalist('filter-button__ingredients', state.ingredients, ingredientsSearchBar, ingredientsSuggestionsList)
});
applianceSearchBar.addEventListener("input",function (){
    displayDatalist('filter-button__appliance', state.appliance, applianceSearchBar, applianceSuggestionsList)
});
utensilsSearchBar.addEventListener("input",function (){
    displayDatalist('filter-button__utensils', state.utensils, utensilsSearchBar, utensilsSuggestionsList)
});
searchRecipe.addEventListener("input", getRecipesWithSearchBar);
displayRecipes(recipes);
displayNbOfRecipes(recipes);