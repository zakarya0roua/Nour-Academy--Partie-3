import { groupes, eleves } from "./data.js"

const listeEleves = document.querySelector("#liste-eleves")
const compteur = document.querySelector("#compteur")
const filtreGroupe = document.querySelector("#filtre-groupe")
const recherche = document.querySelector("#recherche")


function creerLigne(eleve){
    const li = document.createElement("li")
    const div1 = document.createElement("div")
    const buttonFiche = document.createElement("button")
    const spanNom = document.createElement("span")
    const spanAbsence = document.createElement("span")
    const spanMoyenne = document.createElement("span")
    const div2 = document.createElement("div")
    const buttonAbsence = document.createElement("button")
    const label = document.createElement("label")
    const spanLabel = document.createElement("span")
    const input = document.createElement("input")
    const buttonAjouter = document.createElement("button")

    li.dataset.id = eleve.id
    buttonFiche.type = "button"
    buttonAbsence.type = "button"
    buttonAjouter.type = "button"
    input.type = "number"
    input.placeholder = "Note"
    input.min = 0
    input.max = 20
    input.step = 0.5

    li.classList.add("rounded-2xl", "border", "border-line", "bg-card", "p-3")
    div1.classList.add("flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center")
    buttonFiche.classList.add("btn-fiche", "flex", "min-h-11", "flex-1", "items-center", "gap-3", "text-left")
    spanNom.classList.add("block", "truncate", "font-medium")
    spanAbsence.classList.add("block", "text-sm", "text-muted")
    spanMoyenne.classList.add("font-serif", "text-xl")
    div2.classList.add("flex", "gap-2")
    buttonAbsence.classList.add("btn-absent", "h-11", "rounded-full", "border", "border-line", "px-3", "sm:px-4", "text-sm", "font-medium", "hover:bg-paper")
    label.classList.add("flex-1")
    spanLabel.classList.add("sr-only")
    input.classList.add("h-11", "w-full", "rounded-full", "border", "border-line", "bg-paper", "px-4", "text-sm", "lg:w-24")
    buttonAjouter.classList.add("btn-note", "h-11", "rounded-full", "bg-black", "px-3", "sm:px-4", "text-sm", "font-medium", "text-white", "hover:bg-brand")



    let moyenne;
    if(eleve.notes.length > 0){
        const sum = eleve.notes.reduce((total, note) => total + note, 0)
        moyenne = (sum / eleve.notes.length).toFixed(1)
        moyenne = moyenne.replace(".", ",")
        moyenne += " / 20"
    }else{
        moyenne = "—";
    }

    spanNom.textContent = `${eleve.nom} ${eleve.prenom}`
    spanAbsence.textContent = `${eleve.absences} Absence`
    spanMoyenne.textContent = `${moyenne}`
    buttonAbsence.textContent = "Absence"
    spanLabel.textContent = "Note sur 20"
    buttonAjouter.textContent = "Ajouter la note"

    buttonFiche.append(spanNom)
    buttonFiche.append(spanAbsence)
    buttonFiche.append(spanMoyenne);

    
    
    label.append(spanLabel)
    label.append(input)
    
    div2.append(buttonAbsence)
    div2.append(label)
    div2.append(buttonAjouter)
    
    div1.append(buttonFiche);
    div1.append(div2)
    
    li.append(div1)
    
    return (li)
}

const ele = eleves.map(creerLigne)
ele.forEach(i => {
    listeEleves.append(i)
});

compteur.textContent = `${eleves.length} élèves`


groupes.forEach((Option) => {
    const option = document.createElement("option")
    option.textContent = Option.nom
    option.value = Option.id
    filtreGroupe.append(option)
})


filtreGroupe.addEventListener("change", () => {
    const filterGro = eleves.filter((eleve) => 
        { return (
            (eleve.groupeId === Number(filtreGroupe.value)) || (filtreGroupe.value === "")
        )})

})

recherche.addEventListener("input", () => {
    const filterRech = eleves.filter((eleve) => 
        {return (
            (eleve.nom.toLowerCase().includes(recherche.value.toLowerCase())) || 
                                                eleve.prenom.toLowerCase().includes(recherche.value.toLowerCase())
        )

})
})

