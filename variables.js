import { recipes } from "/recipes.js";
export const ingredientsSearchBar = document.querySelector("#bloc-ingredients__input");
export const ingredientsSuggestionsList = document.querySelector("#bloc-ingredients__list");
export const applianceSearchBar = document.querySelector("#bloc-appliance__input");
export const applianceSuggestionsList = document.querySelector("#bloc-appliance__list");
export const utensilsSearchBar = document.querySelector("#bloc-utensils__input");
export const utensilsSuggestionsList = document.querySelector("#bloc-utensils__list");
export const listOfRecipes = document.querySelector(".list-recipes");
export const searchRecipe = document.querySelector("#search-recipe__input");
export const listOfTags = document.querySelector('#list-tags');
export const nbRecipesAll = document.querySelector('#nb-recipes-all');
export const nbRecipes = document.querySelector('#nb-recipes__paragraph');
export const lastRecipeId  = recipes[recipes.length - 1].id;
export const downChevronIngredients = document.querySelector('#input-ingredients__chevron-down');
export const downChevronAppliance = document.querySelector('#input-appliance__chevron-down');
export const downChevronUtensils = document.querySelector('#input-utensils__chevron-down');
export const blocIngredients = document.querySelector("#bloc-ingredients");
export const blocAppliance = document.querySelector("#bloc-appliance");
export const blocUtensils = document.querySelector("#bloc-utensils");
export const upChevronIngredients = document.querySelector('#input-ingredients__chevron-up');
export const upChevronAppliance = document.querySelector('#input-appliance__chevron-up');
export const upChevronUtensils = document.querySelector('#input-utensils__chevron-up');