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
    console.log(allSuggestions);
    return allSuggestions
} 

function getRecipes() {
    const valeurRecherche = searchRecipe.value.toLowerCase();
    state.keyword = filterAllList(state.keyword);
    console.log(state.keyword);
    const listRecipe = allIng(valeurRecherche);
    
    if (listRecipe.length === 0) {
      listOfRecipes.innerHTML = "Aucune recette ne contient " + ' "' + valeurRecherche + '" ' + ' vous pouvez chercher "tarte aux pommes", "poisson", etc.';
      listOfRecipes.style.display = "inline-block";
    }
    if (listRecipe.length >= 1) {
        listOfRecipes.innerHTML = " ";
        displayRecipes(filterAllList(listRecipe));
        
    }
    dataIngredients.splice(0, dataIngredients.length);
    dataIngredients = getUniqueItems(getAllIngredients, dataIngredients, listRecipe);
    dataAppliance.splice(0, dataAppliance.length);
    dataAppliance = getUniqueItems(getAllAppliance, dataAppliance, listRecipe);
    dataUtensils.splice(0, dataUtensils.length);
    dataUtensils = getUniqueItems(getAllUtensils, dataUtensils, listRecipe);
    console.log(dataIngredients);
    const filterListrecipes = filterAllList(listRecipe);

    if (valeurRecherche.length == 0) {
        listOfRecipes.innerHTML = "";
        displayRecipes(recipes);
        if (listOfRecipes.style.display == "inline-block") {
            listOfRecipes.style.display = "grid";
            displayRecipes(recipes);
        }
        console.log(state.keyword);
        state.keyword = state.keyword.filter((item) => {
            state.ingredients = getUniqueItems(getAllIngredients, dataIngredients, recipes);
            state.appliance = getUniqueItems(getAllAppliance, dataAppliance, recipes);
            state.utensils = getUniqueItems(getAllUtensils, dataUtensils, recipes);
            return state.ingredients.includes(item) || state.appliance.includes(item) || state.utensils.includes(item);
        });
        state.keyword.forEach((item)=> {
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
            listOfRecipes.innerHTML = " ";
            displayRecipes(filterAllList(allSuggestions));
        })
        console.log(state.keyword);
        console.log(filterListrecipes);
        
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

function recipesWithIngredientsFilter(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
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
            })
            console.log(state.keyword);
            
            if (state.keyword.length >= 1) {
                let recipeList = state.keyword.flatMap((element) => {
                    return allIng(element);
                  });    
                  console.log(recipeList);   
                  listeSuggestionsIngredients.innerHTML = " ";
                  listeSuggestionsAppliance.innerHTML = " ";
                  listeSuggestionsUtensils.innerHTML = " ";  
                  console.log(state.ingredients);             
                  state.ingredients = filterAllList(getAllIngredients(recipeList));
                  state.appliance = filterAllList(getAllAppliance(recipeList));
                  state.utensils = filterAllList(getAllUtensils(recipeList));
                  console.log(state.ingredients);
                  listOfRecipes.innerHTML = " ";
                   displayRecipes(filterAllList(recipeList));
            }
            if (state.keyword.length === 0) {
                listeSuggestionsIngredients.innerHTML = " ";
                listeSuggestionsAppliance.innerHTML = " ";
                listeSuggestionsUtensils.innerHTML = " ";  
                state.ingredients = filterAllList(getAllIngredients(recipes));
                state.appliance = filterAllList(getAllAppliance(recipes));
                state.utensils = filterAllList(getAllUtensils(recipes));
                listOfRecipes.innerHTML = " ";
                displayRecipes(recipes);
            }
             
        })
        console.log(state.keyword);
        listeSuggestionsIngredients.innerHTML = " ";
        listeSuggestionsAppliance.innerHTML = " ";
        listeSuggestionsUtensils.innerHTML = " ";
        state.ingredients = state.ingredients.filter((element) =>
            state.keyword.every((keyword) =>
                !element.toLowerCase().includes(keyword.toLowerCase()) 
        ));
        const exportedRecipes = getRecipes();
        const suggIngredients = exportedRecipes.filter((recipe) =>
            state.keyword.every((keyword) =>
                recipe.ingredients.some((ingredient) =>
                    ingredient.ingredient.toLowerCase().includes(keyword.toLowerCase())
                )
            )
        );
        listeSuggestionsIngredients.innerHTML = " ";
        state.ingredients = filterAllList(getAllIngredients(suggIngredients));
        state.ingredients = state.ingredients.filter((element) =>
            state.keyword.every((keyword) =>
                !element.toLowerCase().includes(keyword.toLowerCase()) 
        ));
        console.log(state.ingredients);
        state.appliance = filterAllList(getAllAppliance(suggIngredients));
        state.utensils = filterAllList(getAllUtensils(suggIngredients));
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggIngredients);
    });
}

function recipesWithAppliancelFilter(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
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
            })
            console.log(state.keyword);
            
            if (state.keyword.length >= 1) {
                let recipeList = state.keyword.flatMap((element) => {
                    return filterAllList(getAllAppliance(element));
                  });    
                  console.log(recipeList);   
                  listeSuggestionsIngredients.innerHTML = " ";
                  listeSuggestionsAppliance.innerHTML = " ";
                  listeSuggestionsUtensils.innerHTML = " "; 
                  console.log(state.appliance);             
                  state.appliance = filterAllList(getAllAppliance(recipeList));
                  state.ingredients = filterAllList(getAllIngredients(recipeList));
                  state.utensils = filterAllList(getAllUtensils(recipeList));
                  console.log(state.appliance);
                  listOfRecipes.innerHTML = " ";
                   displayRecipes(filterAllList(recipeList));
            }
            if (state.keyword.length === 0) {
                listeSuggestionsIngredients.innerHTML = " ";
                listeSuggestionsAppliance.innerHTML = " ";
                listeSuggestionsUtensils.innerHTML = " ";
                state.appliance = filterAllList(getAllAppliance(recipes));
                state.ingredients = filterAllList(getAllIngredients(recipes));
                state.utensils = filterAllList(getAllUtensils(recipes));
                listOfRecipes.innerHTML = " ";
                displayRecipes(recipes);
            }
             
        });
        listeSuggestionsIngredients.innerHTML = " ";
        listeSuggestionsAppliance.innerHTML = " ";
        listeSuggestionsUtensils.innerHTML = " ";
        state.appliance = state.appliance.filter((element) =>
            state.keyword.every((keyword) =>
                !element.toLowerCase().includes(keyword.toLowerCase()) 
        ));
        const exportedRecipes = getRecipes();
        const suggAppliance = exportedRecipes.filter((recipe) =>
            state.keyword.every((keyword) =>
            recipe.description.toLowerCase().includes(keyword.toLowerCase()) ||
            recipe.appliance.toLowerCase().includes(keyword.toLowerCase())
            )
        );
        console.log(suggAppliance);
        listeSuggestionsAppliance.innerHTML = " ";
        state.ingredients = filterAllList(getAllIngredients(suggAppliance));
        state.appliance = filterAllList(getAllAppliance(suggAppliance));
        state.utensils = filterAllList(getAllUtensils(suggAppliance));
        state.appliance = state.appliance.filter((element) =>
        state.keyword.every((keyword) =>
            !element.toLowerCase().includes(keyword.toLowerCase()) 
        ));
        console.log(state.appliance);
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggAppliance);
    });
}
function allUst(item) {
    const suggestions = recipes.filter((recipe) =>
      recipe.ustensils.some((utensil) =>
        utensil.toLowerCase().includes(item.toLowerCase())
      )
    );
  
    console.log(suggestions);
    return suggestions;
  }
function recipesWithUtensilslFilter(option, item, filterButtonClass) {
    option.addEventListener('click', function() {
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
        const exportedRecipes = getRecipes();
        const suggUtensils = exportedRecipes.filter((recipe) =>
            state.keyword.every((keyword) =>
                recipe.ustensils.some((item) =>
                    item.toLowerCase().includes(keyword.toLowerCase())
                )
            )
        );
        closeButton.addEventListener('click', function() {
            filterButton.remove();
            state.keyword = state.keyword.filter((keyword)=> {
                return !keyword.toLowerCase().includes(item);
            })
            console.log(state.keyword);
            if (state.keyword.length >= 1) {
                let recipeList = state.keyword.flatMap((element) => {
                    return allUst(element);
                  });     
                  console.log(recipeList);   
                  listeSuggestionsIngredients.innerHTML = " ";
                  listeSuggestionsAppliance.innerHTML = " ";
                  listeSuggestionsUtensils.innerHTML = " "; 
                  console.log(state.utensils);             
                  state.utensils = filterAllList(getAllUtensils(recipeList));
                  state.ingredients = filterAllList(getAllIngredients(recipeList));
                  state.appliance = filterAllList(getAllAppliance(recipeList));
                  console.log(state.utensils);
                  listOfRecipes.innerHTML = " ";
                  displayRecipes(filterAllList(recipeList));
            }
            if (state.keyword.length === 0) {
                listeSuggestionsIngredients.innerHTML = " ";
                listeSuggestionsAppliance.innerHTML = " ";
                listeSuggestionsUtensils.innerHTML = " ";
                state.utensils = filterAllList(getAllUtensils(recipes));
                state.ingredients = filterAllList(getAllIngredients(recipes));
                state.appliance = filterAllList(getAllAppliance(recipes));
                listOfRecipes.innerHTML = " ";
                displayRecipes(recipes);
            }
             
        });
        listeSuggestionsIngredients.innerHTML = " ";
        listeSuggestionsAppliance.innerHTML = " ";
        listeSuggestionsUtensils.innerHTML = " ";
        state.utensils = state.utensils.filter((element) =>
            state.keyword.every((keyword) =>
            !element.toLowerCase().includes(keyword.toLowerCase()) 
            )
        );
        
        //console.log(suggUtensils);
        listeSuggestionsUtensils.innerHTML = " ";
        state.ingredients = filterAllList(getAllIngredients(suggUtensils));
        state.appliance = filterAllList(getAllAppliance(suggUtensils));
        state.utensils = filterAllList(getAllUtensils(suggUtensils));
        state.utensils = state.utensils.filter((element) =>
        state.keyword.every((keyword) =>
            !element.toLowerCase().includes(keyword.toLowerCase())
        ));
        listOfRecipes.innerHTML = " ";
        displayRecipes(suggUtensils);
    });
}

state.ingredients = getUniqueItems(getAllIngredients, dataIngredients, recipes);
state.appliance = getUniqueItems(getAllAppliance, dataAppliance, recipes);
state.utensils = getUniqueItems(getAllUtensils, dataUtensils, recipes);

function showSuggestionsIngredients() {
    const valeurRecherche = champRechercheIngredients.value.toLowerCase();
    listeSuggestionsIngredients.innerHTML = "";
    console.log(state.ingredients);
    if (valeurRecherche.length == 0) {
        state.ingredients.forEach((item) => {
            const option = document.createElement("li");
            option.classList.add("li-ingredients");
            option.textContent = item;
            listeSuggestionsIngredients.appendChild(option);
            recipesWithIngredientsFilter(option, item, "filter-button__ingredients");
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
       state.appliance.forEach(item => {
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
        state.utensils.forEach(item => {
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

champRechercheIngredients.addEventListener("input",showSuggestionsIngredients);
champRechercheAppliance.addEventListener("input",showSuggestionsAppliance);
champRechercheUtensils.addEventListener("input",showSuggestionsUtensils);
searchRecipe.addEventListener("input", getRecipes);
displayRecipes(recipes);
