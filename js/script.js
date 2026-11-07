
import { groupes, eleves } from "./data.js";

const listeEleves = document.querySelector("#liste-eleves");
const compteur = document.querySelector("#compteur");
const filtreGroupe = document.querySelector("#filtre-groupe");
const recherche = document.querySelector("#recherche");
const formEleve = document.querySelector("#form-eleve");

const prenomInput = document.querySelector("#prenom");
const nomInput = document.querySelector("#nom");
const groupeInput = document.querySelector("#groupe");
const emailInput = document.querySelector("#email");
const telephoneInput = document.querySelector("#telephone");
const codeInput = document.querySelector("#code");

const msgPrenom = document.querySelector("#prenom-msg");
const msgNom = document.querySelector("#nom-msg");
const msgGroupe = document.querySelector("#groupe-msg");
const msgEmail = document.querySelector("#email-msg");
const msgTelephone = document.querySelector("#telephone-msg");
const msgCode = document.querySelector("#code-msg");

const formSucces = document.querySelector("#form-succes");
const formErreur = document.querySelector("#form-erreur");

const validatePrenom = /^[a-zA-ZÀ-ÿ -]{2,}$/;
const validateNom = /^[a-zA-ZÀ-ÿ -]{2,}$/;
const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateTelephone = /^(06|07)\d{8}$|^\+212(6|7)\d{8}$/;
const validateCode = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const validation = {
    prenom: false,
    nom: false,
    groupe: false,
    email: false,
    telephone: false,
    code: false
};



function creerLigne(eleve) {
    const li = document.createElement("li");
    const div1 = document.createElement("div");
    const buttonFiche = document.createElement("button");
    const spanNom = document.createElement("span");
    const spanAbsence = document.createElement("span");
    const spanMoyenne = document.createElement("span");
    const div2 = document.createElement("div");
    const buttonAbsence = document.createElement("button");
    const label = document.createElement("label");
    const spanLabel = document.createElement("span");
    const input = document.createElement("input");
    const buttonAjouter = document.createElement("button");

    li.dataset.id = eleve.id;

    buttonFiche.type = "button";
    buttonAbsence.type = "button";
    buttonAjouter.type = "button";

    input.type = "number";
    input.placeholder = "Note";
    input.min = 0;
    input.max = 20;
    input.step = 0.5;

    li.classList.add("rounded-2xl", "border", "border-line", "bg-card", "p-3");
    div1.classList.add("flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center");
    buttonFiche.classList.add("btn-fiche", "flex", "min-h-11", "flex-1", "items-center", "gap-3", "text-left");
    spanNom.classList.add("block", "truncate", "font-medium");
    spanAbsence.classList.add("block", "text-sm", "text-muted");
    spanMoyenne.classList.add("font-serif", "text-xl");
    div2.classList.add("flex", "gap-2");
    buttonAbsence.classList.add("btn-absent", "h-11", "rounded-full", "border", "border-line", "px-3", "text-sm");
    label.classList.add("flex-1");
    spanLabel.classList.add("sr-only");
    input.classList.add("h-11", "w-full", "rounded-full", "border", "border-line", "bg-paper", "px-4", "text-sm");
    buttonAjouter.classList.add("btn-note", "h-11", "rounded-full", "bg-black", "px-3", "text-sm", "text-white");


    let moyenne;

    if (eleve.notes.length > 0) {
        const somme = eleve.notes.reduce((total, note) => total + note, 0);
        moyenne = (somme / eleve.notes.length).toFixed(1);
        moyenne = moyenne.replace(".", ",") + " / 20";
    } else {
        moyenne = "—";
    }

    spanNom.textContent = `${eleve.nom} ${eleve.prenom}`;
    spanAbsence.textContent = `${eleve.absences} Absence`;
    spanMoyenne.textContent = moyenne;

    buttonAbsence.textContent = "Absence";
    spanLabel.textContent = "Note sur 20";
    buttonAjouter.textContent = "Ajouter la note";

    buttonFiche.append(spanNom, spanAbsence, spanMoyenne);
    label.append(spanLabel, input);
    div2.append(buttonAbsence, label, buttonAjouter);
    div1.append(buttonFiche, div2);
    li.append(div1);

    if (eleve.absences >= 3) {
        const spanAlerte = document.createElement("span");

        spanAlerte.textContent = "Prévenir les parents";
        spanAlerte.classList.add("bg-red-200", "text-red-800", "px-3", "py-1", "rounded-full");

        li.append(spanAlerte);
        li.classList.add("border-red-500", "border-[3px]");
    }

    return li;
}

eleves.map(creerLigne).forEach((card) => {
    listeEleves.append(card);
});

compteur.textContent = `${eleves.length} élèves`;

groupes.forEach((optionGroupe) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = optionGroupe.id;
    option1.textContent = optionGroupe.nom;

    option2.value = optionGroupe.id;
    option2.textContent = optionGroupe.nom;

    filtreGroupe.append(option1);
    groupeInput.append(option2);
});

function afficherEleves() {
    listeEleves.replaceChildren();

    const aucunResultat = document.querySelector("#aucun-resultat");

    const resultat = eleves.filter((eleve) => {
        const verifiGroupe =
            filtreGroupe.value === "" ||
            eleve.groupeId === Number(filtreGroupe.value);

        const texte = recherche.value.toLowerCase();

        const verifiRecherche =
            eleve.nom.toLowerCase().includes(texte) ||
            eleve.prenom.toLowerCase().includes(texte);

        return verifiGroupe && verifiRecherche;
    });

    resultat.map(creerLigne).forEach((card) => {
        listeEleves.append(card);
    });

    compteur.textContent = `${resultat.length} élèves`;
    aucunResultat.hidden = resultat.length !== 0;
}

filtreGroupe.addEventListener("change", afficherEleves);
recherche.addEventListener("input", afficherEleves);

listeEleves.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    const li = button.closest("li");

    if (!li) return;

    const id = Number(li.dataset.id);

    const eleve = eleves.find((item) => item.id === id);

    if (!eleve) return;

    if (button.classList.contains("btn-absent")) {
        eleve.absences += 1;
        li.replaceWith(creerLigne(eleve));
    }

    if (button.classList.contains("btn-note")) {
        const input = li.querySelector("input");

        if (input.value === "") return;

        const note = Number(input.value);

        if (note >= 0 && note <= 20) {
            eleve.notes.push(note);
            li.replaceWith(creerLigne(eleve));
        } else {
            const ancienneErreur = li.querySelector(".error-note");

            if (ancienneErreur) ancienneErreur.remove();

            const erreur = document.createElement("p");

            erreur.textContent = "La note doit être entre 0 et 20";
            erreur.classList.add("error-note", "text-red-600", "text-sm");

            li.append(erreur);
        }
    }
});

function verifierChamp(champ) {

    if (champ === prenomInput) {
        validation.prenom = validatePrenom.test(champ.value.trim());

        msgPrenom.textContent = validation.prenom ? "Prénom valide." : "2 caractères minimum : lettres, espaces ou tirets.";
    }

    if (champ === nomInput) {
        validation.nom = validateNom.test(champ.value.trim());

        msgNom.textContent = validation.nom ? "Nom valide." : "2 caractères minimum : lettres, espaces ou tirets.";
    }

    if (champ === groupeInput) {
        validation.groupe = champ.value !== "";

        msgGroupe.textContent = validation.groupe ? "Groupe valide." : "Choisissez un groupe.";
    }

    if (champ === emailInput) {
        validation.email = validateEmail.test(champ.value.trim());

        msgEmail.textContent = validation.email ? "Email valide." : "Email invalide.";
    }

    if (champ === telephoneInput) {
        validation.telephone = validateTelephone.test(champ.value.trim());

        msgTelephone.textContent = validation.telephone ? "Téléphone valide." : "06 / 07 ou +212 6 / 7, puis 8 chiffres.";
    }

    if (champ === codeInput) {
        validation.code = validateCode.test(champ.value);

        msgCode.textContent = validation.code ? "Code valide." : "8 caractères minimum, une majuscule, un chiffre et un caractère spécial.";
    }

    if (validation[champ.id]) {
        champ.classList.add("border-green-500");
        champ.classList.remove("border-red-500");
    } else {
        champ.classList.add("border-red-500");
        champ.classList.remove("border-green-500");
    }
}

formEleve.addEventListener("input", (event) => {
    verifierChamp(event.target);
});

formEleve.addEventListener("change", (event) => {
    if (event.target === groupeInput) {
        verifierChamp(groupeInput);
    }
});

formEleve.addEventListener("submit", (event) => {
    event.preventDefault();

    formSucces.hidden = true;
    formErreur.hidden = true;

    const champs = [
        prenomInput,
        nomInput,
        groupeInput,
        emailInput,
        telephoneInput,
        codeInput
    ];

    champs.forEach((champ) => {
        verifierChamp(champ);
    });

    const formulaireValide = Object.values(validation).every((valeur) => {
        return valeur === true;
    });

    if (!formulaireValide) {
        const premierErreur = champs.find((champ) => {
            return validation[champ.id] === false;
        });

        premierErreur.focus();
        formErreur.textContent = "Veuillez corriger les erreurs.";
        formErreur.hidden = false;

        return;
    }

    const groupeId = Number(groupeInput.value);

    const existe = eleves.some((eleve) => {
        return (
            eleve.prenom.toLowerCase() === prenomInput.value.trim().toLowerCase() &&
            eleve.nom.toLowerCase() === nomInput.value.trim().toLowerCase() &&
            eleve.groupeId === groupeId
        );
    });

    if (existe) {
        formErreur.textContent = "Cet élève existe déjà dans ce groupe.";
        formErreur.hidden = false;
        return;
    }

    const nombreEleves = eleves.filter((eleve) => {
        return eleve.groupeId === groupeId;
    }).length;

    if (nombreEleves >= 15) {
        formErreur.textContent = "Ce groupe contient déjà 15 élèves.";
        formErreur.hidden = false;
        return;
    }

    const nouvelEleve = {
        id: Math.max(...eleves.map((eleve) => eleve.id)) + 1,
        prenom: prenomInput.value.trim(),
        nom: nomInput.value.trim(),
        groupeId: groupeId,
        telephoneParent: telephoneInput.value.trim(),
        absences: 0,
        notes: []
    };

    eleves.push(nouvelEleve);

    filtreGroupe.value = groupeId;

    afficherEleves();

    formSucces.textContent = "Élève ajouté avec succès !";
    formSucces.hidden = false;

    formEleve.reset();

    Object.keys(validation).forEach((key) => {
        validation[key] = false;
    });

    champs.forEach((champ) => {
        champ.classList.remove("border-green-500", "border-red-500");
    });

    msgPrenom.textContent = "";
    msgNom.textContent = "";
    msgGroupe.textContent = "";
    msgEmail.textContent = "";
    msgTelephone.textContent = "";
    msgCode.textContent = "";
});
