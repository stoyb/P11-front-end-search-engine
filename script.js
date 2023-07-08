                            /* Variables and constants */
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
const nbRecipes = document.querySelector('#nb-recipes');
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
//Number of recipes
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
// Function to remove the occurrences 
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
    const recipesList = [
        ...suggestionsName,
        ...suggestionsDescription,
        ...suggestionsIngredients
    ];
    return recipesList
} 
// Changes all the three filters' states 
function changeAllStates(recipes) {
    state.ingredients = getUniqueItems(getAllIngredients, state.ingredients, recipes);
    state.appliance = getUniqueItems(getAllAppliance, state.appliance, recipes);
    state.utensils = getUniqueItems(getAllUtensils, state.utensils, recipes);
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
        nbRecipes.innerHTML = " ";
        nbRecipes.innerHTML = filterAList(listRecipe).length;
    }
    state.ingredients.splice(0, state.ingredients.length);
    state.appliance.splice(0, state.appliance.length);
    state.utensils.splice(0, state.utensils.length);
    changeAllStates(listRecipe)
    const filterListrecipes = filterAList(listRecipe);
    if (searchValue.length == 0) {
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        nbRecipes.innerHTML = " ";
        nbRecipes.innerHTML = recipes.length;
        if (listOfRecipes.style.display == "inline-block") {
            listOfRecipes.style.display = "grid";
            displayRecipes(recipes);
            nbRecipes.innerHTML = " ";
            nbRecipes.innerHTML = recipes.length;
        }
        state.keyword = state.keyword.filter((item) => {
            changeAllStates(recipes)
            return state.ingredients.includes(item) || state.appliance.includes(item) || state.utensils.includes(item);
        });
        state.keyword.forEach((item)=> {
            const recipesList = selectRecipes(item);
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAList(recipesList));
            nbRecipes.innerHTML = " ";
            nbRecipes.innerHTML = filterAList(recipesList).length;
        })
      } else if (searchValue.length >= 3) {
        state.ingredients.forEach((item) => {
            if (item.toLowerCase().includes(searchValue) && item.toLowerCase().endsWith(searchValue)) {
                state.keyword.push(searchValue);
            }
        });
    }
    return filterListrecipes;
}
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
            if (state.keyword.length >= 1 || listOfTags.innerHTML === "") {
                let recipeList = filterRecipesWithKeyWords();
                updateStates(recipeList);
                listOfRecipes.innerHTML = "";
                displayRecipes(filterAList(recipeList));
                nbRecipes.innerHTML = " ";
                nbRecipes.innerHTML = filterAList(recipeList).length;
                
            }
            if (state.keyword.length === 0) {
                updateStates(recipes);
                listOfRecipes.innerHTML = "";
                displayRecipes(recipes);
                nbRecipes.innerHTML = " ";
                nbRecipes.innerHTML = recipes.length;
            }
        });
        const recipeList = filterRecipesWithKeyWords();
        updateStates(recipeList);
        listOfRecipes.innerHTML = "";
        displayRecipes(recipeList);
        nbRecipes.innerHTML = " ";
        nbRecipes.innerHTML = recipeList.length;
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
                                /* Calls of functionn */
openListOfTags(downChevronIngredients, upChevronIngredients, blocIngredients);
openListOfTags(downChevronAppliance, upChevronAppliance, blocAppliance);
openListOfTags(downChevronUtensils, upChevronUtensils, blocUtensils);
closeListOfTags(upChevronIngredients, downChevronIngredients, blocIngredients);
closeListOfTags(upChevronAppliance, downChevronAppliance, blocAppliance);
closeListOfTags(upChevronUtensils, downChevronUtensils, blocUtensils);
changeAllStates(recipes)
ingredientsSearchBar.addEventListener("input",function (){
    displayDatalist(state.ingredients, ingredientsSearchBar, ingredientsSuggestionsList)
});
applianceSearchBar.addEventListener("input",function (){
    displayDatalist(state.appliance, applianceSearchBar, applianceSuggestionsList)
});
utensilsSearchBar.addEventListener("input",function (){
    displayDatalist(state.utensils, utensilsSearchBar, utensilsSuggestionsList)
});
searchRecipe.addEventListener("input", getRecipesWithSearchBar);
displayRecipes(recipes);
nbRecipes.innerHTML = " ";
nbRecipes.innerHTML = recipes.length;