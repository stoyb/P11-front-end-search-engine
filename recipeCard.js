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
    function getRecipeCardDOM() {
        const card = document.createElement("a");
        card.setAttribute("href", "#");
        card.classList.add('list-recipes__card');
        const title = document.createElement("p");
        title.textContent = name;
        title.classList.add('list-recipes__title');
        const durationContainer = document.createElement('div');
        durationContainer.classList.add('list-recipes__time');
        const iconContainer = document.createElement('span');
        const iconTime = document.createElement('i');
        iconTime.classList.add("fa", "fa-clock");
        const duration = document.createElement('p');
        duration.textContent = time + " min"; 
        const foodContainer = document.createElement('div');
        foodContainer.classList.add('list-recipes__ingredients');
        for (const ingredientData of ingredientsListData) {
            const foodContent = document.createElement('div');
            foodContent.classList.add('ingredient-content');
            const foodName = document.createElement('p');
            foodName.textContent = ingredientData.ingredientName;
            const foodQuantity = document.createElement('p');
            foodQuantity.textContent =  ": " + ingredientData.ingredientQuantity;
            const unit = document.createElement('p');
            unit.textContent = ingredientData.ingredientUnit;
            foodContent.appendChild(foodName);
            foodContent.appendChild(foodQuantity);
            foodContent.appendChild(unit);
            foodContainer.appendChild(foodContent);
        }
        const instructionContainer = document.createElement("div");
        instructionContainer.textContent = description;
        instructionContainer.classList.add('list-recipes__description');
        iconContainer.appendChild(iconTime);
        durationContainer.appendChild(iconContainer);
        durationContainer.appendChild(duration);
        card.appendChild(foodContainer);
        card.appendChild(instructionContainer);
        card.appendChild(durationContainer);
        card.appendChild(title);
        return (card)
    }
    

    return { name, id, time, description, ingredientsListData, ingredientName, ingredientQuantity, getRecipeCardDOM}
}

