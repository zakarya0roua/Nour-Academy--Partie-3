import { groupes, eleves } from "./data.js";

const listeEleves = document.querySelector("#liste-eleves");
const compteur = document.querySelector("#compteur");
const filtreGroupe = document.querySelector("#filtre-groupe");
const recherche = document.querySelector("#recherche");
const formEleve = document.querySelector("#form-eleve");

//validation des eleve
const prenomInput = document.querySelector("#prenom");
const nomInput = document.querySelector("#nom");
const groupe = document.querySelector("#groupe");
const emailInptut = document.querySelector("#email");
const telephoneInput = document.querySelector("#telephone");
const codeInput = document.querySelector("#code");

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
  div1.classList.add(
    "flex",
    "flex-col",
    "gap-3",
    "lg:flex-row",
    "lg:items-center",
  );
  buttonFiche.classList.add(
    "btn-fiche",
    "flex",
    "min-h-11",
    "flex-1",
    "items-center",
    "gap-3",
    "text-left",
  );
  spanNom.classList.add("block", "truncate", "font-medium");
  spanAbsence.classList.add("block", "text-sm", "text-muted");
  spanMoyenne.classList.add("font-serif", "text-xl");
  div2.classList.add("flex", "gap-2");
  buttonAbsence.classList.add(
    "btn-absent",
    "h-11",
    "rounded-full",
    "border",
    "border-line",
    "px-3",
    "sm:px-4",
    "text-sm",
    "font-medium",
    "hover:bg-paper",
  );
  label.classList.add("flex-1");
  spanLabel.classList.add("sr-only");
  input.classList.add(
    "h-11",
    "w-full",
    "rounded-full",
    "border",
    "border-line",
    "bg-paper",
    "px-4",
    "text-sm",
    "lg:w-24",
  );
  buttonAjouter.classList.add(
    "btn-note",
    "h-11",
    "rounded-full",
    "bg-black",
    "px-3",
    "sm:px-4",
    "text-sm",
    "font-medium",
    "text-white",
    "hover:bg-brand",
  );

  let moyenne;
  if (eleve.notes.length > 0) {
    const sum = eleve.notes.reduce((total, note) => total + note, 0);
    moyenne = (sum / eleve.notes.length).toFixed(1);
    moyenne = moyenne.replace(".", ",");
    moyenne += " / 20";
  } else {
    moyenne = "—";
  }

  spanNom.textContent = `${eleve.nom} ${eleve.prenom}`;
  spanAbsence.textContent = `${eleve.absences} Absence`;
  spanMoyenne.textContent = `${moyenne}`;
  buttonAbsence.textContent = "Absence";
  spanLabel.textContent = "Note sur 20";
  buttonAjouter.textContent = "Ajouter la note";

  buttonFiche.append(spanNom);
  buttonFiche.append(spanAbsence);
  buttonFiche.append(spanMoyenne);

  label.append(spanLabel);
  label.append(input);

  div2.append(buttonAbsence);
  div2.append(label);
  div2.append(buttonAjouter);

  div1.append(buttonFiche);
  div1.append(div2);

  li.append(div1);

  if (eleve.absences >= 3) {
    const spanAbsencesParents = document.createElement("span");
    spanAbsencesParents.textContent = "Prévenir les parents";
    spanAbsencesParents.classList.add(
      "bg-red-200",
      "text-red-800",
      "px-3",
      "py-1",
      "rounded-full",
      "text-[11px]",
      "font-medium",
    );
    li.append(spanAbsencesParents);
    li.classList.add("border-red-500", "bg-red-300", "border-[3px]");
  }

  return li;
}

const ele = eleves.map(creerLigne);
ele.forEach((i) => {
  listeEleves.append(i);
});

compteur.textContent = `${eleves.length} élèves`;

groupes.forEach((Option) => {
  const option = document.createElement("option");
  option.textContent = Option.nom;
  option.value = Option.id;
  filtreGroupe.append(option);
  groupe.append(option.cloneNode(true));
});

function afficherEleves() {
  listeEleves.replaceChildren();
  const aucunResultat = document.querySelector("#aucun-resultat");
  const filterGroAndReh = eleves.filter((eleve) => {
    const verifiGro =
      eleve.groupeId === Number(filtreGroupe.value) ||
      filtreGroupe.value === "";
    const verifiRech =
      eleve.nom.toLowerCase().includes(recherche.value.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(recherche.value.toLowerCase());
    return verifiGro && verifiRech;
  });
  const cards = filterGroAndReh.map(creerLigne);
  cards.forEach((card) => {
    listeEleves.append(card);
  });
  compteur.textContent = `${cards.length} élèves`;
  if (cards.length === 0) {
    aucunResultat.hidden = false;
  } else {
    aucunResultat.hidden = true;
  }
}

filtreGroupe.addEventListener("change", () => {
  afficherEleves();
});

recherche.addEventListener("input", () => {
  afficherEleves();
});

// listeEleves.addEventListener("keydown", (event) => {
//     if(event.key == "Enter"){
//         const button = document.querySelector(".btn-note")
//         button.click()
//     }
// })

listeEleves.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const buttonAB = button.classList.contains("btn-absent");
  const buttonAJ = button.classList.contains("btn-note");
  const li = event.target.closest("li");
  const id = Number(li.dataset.id);
  const eleveFind = eleves.find((eleve) => {
    return eleve.id === id;
  });

  if (buttonAB) {
    eleveFind.absences += 1;
    li.replaceWith(creerLigne(eleveFind));
  } else if (buttonAJ) {
    const li = event.target.closest("li");
    const input = li.querySelector("input");
    if (!input.value) {
      return;
    }

    const inputValue = Number(input.value);
    if (inputValue >= 0 && inputValue <= 20) {
      eleveFind.notes.push(inputValue);
      input.value = "";
      li.replaceWith(creerLigne(eleveFind));
    } else {
      const errorNote = document.createElement("p");

      errorNote.textContent = "La note doit être entre 0 et 20";
      errorNote.classList.add("text-red-600", "text-sm", "mt-2", "error-note");

      // xrt nta3 bax taficha mra wahda
      const errorLi = li.querySelector(".error-note");
      if (errorLi) errorLi.remove();
      li.append(errorNote);
    }
  }
});

//validation des eleves

const msgPrenom = document.querySelector("#prenom-msg");
const msgNom = document.querySelector("#nom-msg");
const msgGroupe = document.querySelector("#groupe-msg");
const msgEmail = document.querySelector("#email-msg");
const msgTelephone = document.querySelector("#telephone-msg");
const msgCode = document.querySelector("#code-msg");

const validatePrenom = /^[a-zA-ZÀ-ÿ -]{2,}$/;
const validateNom = /^[a-zA-ZÀ-ÿ -]{2,}$/;
const validateEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validateTelephone = /^(06|07)\d{8}$|^\+212(6|7)\d{8}$/;
const validateCode = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

formEleve.addEventListener("input", (event) => {
  if (event.target === prenomInput) {
    const prenom = prenomInput.value;

    if (validatePrenom.test(prenom)) {
      msgPrenom.textContent = "Prénom valide.";
      prenomInput.classList.add("border-green-500");
      prenomInput.classList.remove("border-red-500");
    } else {
      msgPrenom.textContent = "Prénom invalide.";
      prenomInput.classList.add("border-red-500");
      prenomInput.classList.remove("border-green-500");
    }
  }

  if (event.target === nomInput) {
    const nom = nomInput.value;

    if (validateNom.test(nom)) {
      msgNom.textContent = "Nom valide.";
      nomInput.classList.add("border-green-500");
      nomInput.classList.remove("border-red-500");
    } else {
      msgNom.textContent = "2 caractères minimum : lettres, espaces ou tirets.";
      nomInput.classList.add("border-red-500");
      nomInput.classList.remove("border-green-500");
    }
  }

  if (event.target === emailInptut) {
    const email = emailInptut.value;

    if (validateEmail.test(email)) {
      msgEmail.textContent = "Email valide.";
      emailInptut.classList.add("border-green-500");
      emailInptut.classList.remove("border-red-500");
    } else {
      msgEmail.textContent = "Email invalide.";
      emailInptut.classList.add("border-red-500");
      emailInptut.classList.remove("border-green-500");
    }
  }
  if (event.target === groupe) {
    if (groupe.value !== "") {
      msgGroupe.textContent = "Groupe valide.";
      groupe.classList.add("border-green-500");
      groupe.classList.remove("border-red-500");
    } else {
      msgGroupe.textContent = "Choisissez un groupe.";
      groupe.classList.add("border-red-500");
      groupe.classList.remove("border-green-500");
    }
  }

  if (event.target === telephoneInput) {
    const telephone = telephoneInput.value;

    if (validateTelephone.test(telephone)) {
      msgTelephone.textContent = "Téléphone valide.";
      telephoneInput.classList.add("border-green-500");
      telephoneInput.classList.remove("border-red-500");
    } else {
      msgTelephone.textContent = "06 / 07 ou +212 6 / 7, puis 8 chiffres.";
      telephoneInput.classList.add("border-red-500");
      telephoneInput.classList.remove("border-green-500");
    }
  }

  if (event.target === codeInput) {
    const code = codeInput.value;

    if (validateCode.test(code)) {
      msgCode.textContent = "Code valide.";
      codeInput.classList.add("border-green-500");
      codeInput.classList.remove("border-red-500");
    } else {
      msgCode.textContent =
        "8 caractères minimum, une majuscule, un chiffre et un caractère spécial.";
      codeInput.classList.add("border-red-500");
      codeInput.classList.remove("border-green-500");
    }
  }
});

formEleve.addEventListener("submit", (event) => {
  event.preventDefault();
});
