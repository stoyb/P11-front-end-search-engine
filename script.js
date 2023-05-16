const listeDonnees = ["Cuillère à Soupe", "Verres", "Presse citron", "Couteau", "Saladier", "Passoire", "Moule à tarte", "Râpe à fromage", "Fourchette", "Casserole", "Moule à gâteaux", "cuillère en bois", "Plat à gratin", "Économe", "Cuillère à melon", "Poêle à frire", "Louche", "Verres", "Fouet", "Rouleau à patisserie", "plaque de cuisson", "cocotte minute", "Bol", "Spatule" ];
const champRecherche = document.querySelector("#bloc-utensils__input");
const listeSuggestions = document.querySelector("#bloc-utensils__list");

champRecherche.addEventListener("input", afficherSuggestions);

function afficherSuggestions() {
    const valeurRecherche = champRecherche.value.toLowerCase();
    listeSuggestions.innerHTML = ""; 
    console.log(champRecherche);
    if (valeurRecherche.length >= 1) {
        const suggestions = listeDonnees.filter(item =>
            item.toLowerCase().startsWith(valeurRecherche)
            );
            
            suggestions.forEach(suggestion => {
                const option = document.createElement("option");
                option.value = suggestion;
                listeSuggestions.appendChild(option);
            });
        }
}
    
    