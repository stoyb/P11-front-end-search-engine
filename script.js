import { recipes } from "/recipes.js";

const dataUtensils = ["Cuillère à Soupe", "Presse citron", "Couteau", "Saladier", "Passoire", "Moule à tarte", "Râpe à fromage", "Fourchette", "Casserole", "Moule à gâteaux", "cuillère en bois", "Plat à gratin", "Économe", "Cuillère à melon", "Poêle à frire", "Louche", "Verres", "Fouet", "Rouleau à patisserie", "plaque de cuisson", "cocotte minute", "Bol", "Spatule" ];
const champRecherche = document.querySelector("#bloc-utensils__input");
const listeSuggestions = document.querySelector("#bloc-utensils__list");

function getAllIngredients(recipes) {
    const ingredientsAll = [];
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsAll.push(ingredient.ingredient);
        });
    });
    
    return ingredientsAll;
}
function getAllAppliance(recipes) {
    const applianceAll = [];
    recipes.forEach(recipe => {
        applianceAll.push(recipe.appliance);
    });
    
    return applianceAll;
}
function getAllUtensils(recipes) {
    const utensilsAll = [];
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((item) => {
            utensilsAll.push(item);
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
function getAllFilters(getAllItems, recipes){
    const itemsList = getAllItems(recipes);
    const filteredList = filterAllList(itemsList);
    console.log(itemsList);
    console.log(filteredList);
}






function showSuggestions() {
    const valeurRecherche = champRecherche.value.toLowerCase();
    listeSuggestions.innerHTML = ""; 
    
    if (valeurRecherche.length >= 1) {
        const suggestions = dataUtensils.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche)
            );
            
            suggestions.forEach(suggestion => {
                const option = document.createElement("li");
                option.textContent = suggestion;
                listeSuggestions.appendChild(option);
                option.addEventListener('click', ()=> {
                    console.log(option.eventvalue);
                })
                
            });
        }
    }
    
    champRecherche.addEventListener("input", showSuggestions);
    
    // Create the filtered lists of filters 
    getAllFilters(getAllIngredients, recipes);
    getAllFilters(getAllAppliance, recipes);
    getAllFilters(getAllUtensils, recipes);