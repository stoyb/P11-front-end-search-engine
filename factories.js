export function recipeFactory(data) {
    
    const { name, id, time, description } = data;
   
    //const picture = `assets/photographers/${portrait}`;
    
    function getRecipeCardDOM() {
        const card = document.createElement("div");
        card.classList.add('list-recipes__card');
        const title = document.createElement("p");
        title.textContent = name;
        const durationContainer = document.createElement('div');
        durationContainer.classList.add('list-recipes__time');
        const iconContainer = document.createElement('span');
        const iconTime = document.createElement('i');
        iconTime.classList.add("fa", "fa-clock");
        const duration = document.createElement('p');
        duration.textContent = time + " min"; 
        const instructionContainer = document.createElement("div");
        instructionContainer.textContent = description;
        card.appendChild(instructionContainer);
        iconContainer.appendChild(iconTime);
        durationContainer.appendChild(iconContainer);
        durationContainer.appendChild(duration);
        card.appendChild(durationContainer);
        card.appendChild(title);



        return (card)
    }
    

    return { name, id, time, description, getRecipeCardDOM}
}

