function ajouterValeur() {
    const nbReclamations = parseInt(document.getElementById("nombre-reclamations").value);
    const montantReclamations = document.getElementById("montant-reclamations");
    for (let i = 1; i <= nbReclamations; i++) {
        montantReclamations.innerHTML += `
            <label for="reclamation-${i}">Montant de la réclamation #${i}</label>
            <input type="number" id="montant-reclamation-${i}" required>
        `;
    }
}

const affichageReclamations = document.getElementById("reclamations");
affichageReclamations.addEventListener("click", afficherReclamations);


function afficherReclamations() {
    const reclamationOui = document.querySelectorAll('input[name="reclamations"][value="reclamations-oui"]').checked;
    const reclamationsResultat = document.getElementById("reclamations-resultat");
    if (reclamationOui) {
        document.getElementById("reclamations-resultat").classList.remove("hidden");
    } else {
        reclamationsResultat.innerHTML = "";
        document.getElementById("reclamations-resultat").classList.add("hidden");
    }
}

const boutonCalcul = document.getElementById("calculer");
boutonCalcul.addEventListener("click", assurance);

function assurance() {
    const annee = new Date().getFullYear;

    const genre = document.getElementById("genre").value; 
    const dateNaissance = new Date(document.getElementById("date-naissance").value);
    const valeurAchat = parseInt(document.getElementById("valeur-achat").value);
    const anneeFabrication = parseInt(document.getElementById("annee-fabrication").value);
    const nbKilometres = parseInt(document.getElementById("kilometres").value);
    const aCamera = document.getElementById('camera-oui').checked;
    const aReclamations = document.getElementById('reclamations-oui').checked;

    const age = annee - dateNaissance.getFullYear();
    const ageVehicule = annee - anneeFabrication;

    const nbReclamations = parseInt(document.getElementById("nombre-reclamations").value);

    const totalReclamations = calculReclamations(aReclamations, nbReclamations);
    const valide = estAssure(genre, age, ageVehicule, valeurAchat, nbKilometres, aCamera, totalReclamations, nbReclamations);

    if (!valide) {
        document.getElementById("resultat").innerHTML = "Désolé, nous n\'avons aucun produit à offrir pour ce profil de client.";
        return;
    }

    const montantBase = calculMontantBase(genre, age, valeurAchat).toFixed(2);
    const assuranceAnnuelle = calculAssuranceAnnuelle(montantBase, nbReclamations, nbKilometres, totalReclamations).toFixed(2);
    const primeMensuelle = (assuranceAnnuelle / 12).toFixed(2);

    afficherResultat(assuranceAnnuelle, primeMensuelle);
}

function calculMontantBase(genre, age, valeurAchat) {
    if (genre !== "femme" && age < 25) {
        return 0.05 * valeurAchat;
    } else if (age >= 75) {
        return 0.04 * valeurAchat;
    } else {
        return 0.015 * valeurAchat;
    }
}

function calculAssuranceAnnuelle(montantBase, nbReclamations, nbKilometres, totalReclamations) {
    let assuranceAnnuelle = montantBase + (350 * nbReclamations) + (0.02 * nbKilometres);
    if (totalReclamations > 25000) {
        assuranceAnnuelle += 700;
    }
    return assuranceAnnuelle;
}

function calculReclamations(aReclamations, nbReclamations) {
    let totalReclamations = 0;

    if (aReclamations) {
        for (let i = 1; i <= nbReclamations; i++) {
            const valeurReclamation = parseInt(document.getElementById(`montant-reclamation${i}`).value);
            totalReclamations += valeurReclamation;
        }
    }
    return totalReclamations;
}

function estAssure(genre, age, ageVehicule, valeurAchat, nbKilometres, aCamera, totalReclamations, nbReclamations) {
    if ((age < 16 && genre === "femme") ||
        (age < 18 && genre !== "femme") ||
        age >= 100 ||
        ageVehicule > 25 ||
        valeurAchat > 100000 ||
        nbKilometres > 50000 ||
        !aCamera ||
        nbReclamations > 4 ||
        totalReclamations > 35000) {
            return false;
        }
        return true;
}

function afficherResultat(assuranceAnnuelle, primeMensuelle) {
    const resultat = document.getElementById("resultat");

    resultat.innerHTML = `
        <h1>Votre assurance</h1>
        <p>Le montant annuel de votre assurance s'élève à ${assuranceAnnuelle}$</p>
        <p>Le montant de votre prime mensuelle s'élève à ${primeMensuelle}$</p>
        `;
}