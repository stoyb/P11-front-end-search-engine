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
    utensils : dataUtensils
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


// Functions for suggestions filters
function showAllIngredientsSuggestions(){
    let dataListItems = state.ingredients;
        dataListItems.forEach(suggestion => {
            const option = document.createElement("li");
            option.textContent = suggestion;
            listeSuggestionsIngredients.appendChild(option);
            // function findWordInObject(obj, word) {
            //     const result = [];
              
            //     Object.values(obj).forEach(value => {
            //       if (typeof value === "string" && value.includes(word)) {
            //         result.push(value);
            //       }
            //     });
            //     return result;
            //   }
            //   const findAWord = findWordInObject(recipes, suggestion);  
            //   console.log(findAWord);
            //   displayRecipes(findAWord);  
               let everClicked = false; 
                      
              option.addEventListener('click', function() {
                if (!everClicked) {
                everClicked = true; 
                const filterButton = document.createElement('p');
                filterButton.classList.add('filter-button');
                filterButton.textContent = suggestion;
                listFilters.appendChild(filterButton);

                }
                // dataListItems = state.ingredients.filter(item => item != suggestion);
              
                // listeSuggestionsIngredients.innerHTML = "";
              
                // dataListItems.forEach(item => {
                //   const option = document.createElement("li");
                //   option.textContent = item;
                //   listeSuggestionsIngredients.appendChild(option);
                // });
              
                // console.log(dataListItems);
                
              });
            
            
        });
    
}

function showAllApplianceSuggestions(){
    const dataListItems = state.appliance;
        dataListItems.forEach(suggestion => {
            const option = document.createElement("li");
            option.textContent = suggestion;
            listeSuggestionsAppliance.appendChild(option);
            option.addEventListener('click', function() {
                alert(suggestion);
            })
            
        });
    
}

function showAllUtensilsSuggestions(){
    const dataListItems = state.utensils;
        dataListItems.forEach(suggestion => {
            const option = document.createElement("li");
            option.textContent = suggestion;
            listeSuggestionsUtensils.appendChild(option);
            option.addEventListener('click', function() {
                alert(suggestion);
            })
            
        });
    
}

function showSuggestionsIngredients() {
    
    const valeurRecherche = champRechercheIngredients.value.toLowerCase();
    listeSuggestionsIngredients.innerHTML = " "; 
    
    if (valeurRecherche.length >= 1) {
        const suggestions = state.ingredients.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche)
            );
            
            suggestions.forEach(suggestion => {
                const option = document.createElement("li");
                option.textContent = suggestion;
                option.classList.add("li-ingredients");
                listeSuggestionsIngredients.appendChild(option);
                option.addEventListener('click', function() {
                    
                })
            });
        }
    }

    
    
    function showSuggestionsAppliance() {
        const valeurRecherche = champRechercheAppliance.value.toLowerCase();
        listeSuggestionsAppliance.innerHTML = ""; 
        
        if (valeurRecherche.length >= 1) {
            const suggestions = state.appliance.filter(item =>
                item.toLowerCase().startsWith(valeurRecherche)
                );
                
                suggestions.forEach(suggestion => {
                    const option = document.createElement("li");
                    option.classList.add("li-appliance");
                    option.textContent = suggestion;
                    listeSuggestionsAppliance.appendChild(option);
                    option.addEventListener('click', function() {
                        alert(suggestion);
                    })
                    
                });
            }
        }

        
        
        function showSuggestionsUtensils() {
            const valeurRecherche = document.getElementById('bloc-utensils__input').value.toLowerCase();
            listeSuggestionsUtensils.innerHTML = "";
          
            if (valeurRecherche.length >= 1) {
              const suggestions = state.utensils.filter(item =>
                item.toLowerCase().startsWith(valeurRecherche)
              );
          
              suggestions.forEach((suggestion) => {
                const option = document.createElement("li");
                option.textContent = suggestion;
                listeSuggestionsUtensils.appendChild(option);
                option.addEventListener('click', function() {
                    alert(suggestion);
                })
              });
            }
          }
          
          

        
        console.log(recipes.ingredients);


//        
function displayRecipes(recipes) {
    recipes.forEach((recipe)=> {
        const modelCard = recipeFactory(recipe);
        const cardRecipe = modelCard.getRecipeCardDOM();
        listOfRecipes.appendChild(cardRecipe);
        
    })
}

function getRecipes() {
    const valeurRecherche = searchRecipe.value.toLowerCase();
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
champRechercheIngredients.addEventListener("click", showAllIngredientsSuggestions);
champRechercheAppliance.addEventListener('click', showAllApplianceSuggestions);
champRechercheUtensils.addEventListener('click', showAllUtensilsSuggestions);
displayRecipes(recipes);

   


    

    