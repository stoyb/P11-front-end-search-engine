//Creates card for a recipe
export function recipeCard(data) {
    const { name, id, time, description, ingredientName, ingredientQuantity } = data;
    const ingredientsListData = data.ingredients.map(
        function(item) {
            const ingredientName = item.ingredient;
            const ingredientQuantity = item.quantity; 
            const ingredientUnit = item.unit;
            return { ingredientName, ingredientQuantity, ingredientUnit }
        }
    ); 
    const picture = `recette${id}.jpg`;
    const path = `img/${picture}`;
    function getRecipeCardDOM() {
        const card = document.createElement("a");
        card.setAttribute("href", "#");
        card.classList.add('list-recipes__card');
        const imgContainer = document.createElement('div'); 
        imgContainer.classList.add('list-recipes__container-up');
        const img = document.createElement('img');
        img.classList.add('list-recipes__img');
        img.setAttribute("src", path);
        const duration = document.createElement('p');
        duration.classList.add('list-recipes__time');
        duration.textContent = time + " min"; 
        const recipeContainer = document.createElement('div'); 
        recipeContainer.classList.add('list-recipes__container-down');
        const title = document.createElement("p");
        title.textContent = name;
        title.classList.add('list-recipes__title');
        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('list-recipes__description-container');
        const inscrutionsLabel = document.createElement('p');
        inscrutionsLabel.classList.add('list-recipes__description-label');
        inscrutionsLabel.textContent = "Recette";
        const instructions = document.createElement("p");
        instructions.classList.add('list-recipes__description');
        instructions.textContent = description;
        const ingredientsContainer = document.createElement('div');
        ingredientsContainer.classList.add('list-recipes__ingredients');
        const ingredientsContainerLabel = document.createElement('p');
        ingredientsContainerLabel.classList.add('list-recipes__ingredients-label');
        ingredientsContainerLabel.textContent = "Ingrédients";
        ingredientsContainer.appendChild(ingredientsContainerLabel);
        const ingredientsContainerContent = document.createElement('div');
        ingredientsContainerContent.classList.add('list-recipes__ingredients-content');
        Array.prototype.createIngredientElements = function (container) {
            this.forEach((ingredientData) => {
              const ingredientContent = document.createElement('div');
              ingredientContent.classList.add('ingredient-content');
              const foodName = document.createElement('p');
              foodName.classList.add('ingredient-content__name');
              foodName.textContent = ingredientData.ingredientName;
              const quantityContainer = document.createElement('div');
              quantityContainer.classList.add('ingredient-content__quantity');
              const nbQuantity = document.createElement('p');
              nbQuantity.textContent = ingredientData.ingredientQuantity;
              const unit = document.createElement('p');
              unit.textContent = ingredientData.ingredientUnit;
              quantityContainer.appendChild(nbQuantity);
              quantityContainer.appendChild(unit);
              ingredientContent.appendChild(foodName);
              ingredientContent.appendChild(quantityContainer);
              container.appendChild(ingredientContent);
            });
          };
        ingredientsListData.createIngredientElements(ingredientsContainerContent);
        imgContainer.appendChild(duration);
        imgContainer.appendChild(img);
        descriptionContainer.appendChild(inscrutionsLabel);
        descriptionContainer.appendChild(instructions);
        ingredientsContainer.appendChild(ingredientsContainerContent);
        recipeContainer.appendChild(title);
        recipeContainer.appendChild(descriptionContainer)
        recipeContainer.appendChild(ingredientsContainer);
        card.appendChild(imgContainer);
        card.appendChild(recipeContainer);
        return (card)

    }
    return { name, id, time, description, ingredientsListData, ingredientName, ingredientQuantity, getRecipeCardDOM}
}

