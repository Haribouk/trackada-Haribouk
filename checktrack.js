import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { homedir } from "os"


// TODO : charger et parser track.json
const texte = readFileSync("track.json", "utf-8")
const track = JSON.parse(texte)

// TODO : construire le chemin vers ~/ada-tech/bloc1/projets
const cheminDossier = join(homedir(), "ada-tech", "bloc1", "projets")

// TODO : vérifier que ce dossier existe et afficher le résultat
if (existsSync(cheminDossier)) {
    console.log("✅ dossier ~/ada-tech/bloc1/projets")
 
    // TODO : pour chaque projet de la track,
    //        vérifier que le dossier existe au bon endroit
    //        vérifier que le repository git est initialisé
    //        vérifier que les fichiers requis sont présents
    //        afficher ✅ ou ❌ avec les erreurs dans l'ordre
    const formaterListe = (items) => {
        if (items.length === 1) return items[0]
        if (items.length === 2) return items.join(" et ")
        const debut = items.slice(0, -1).join(", ")
        return debut + " et " + items.at(-1)
    }

    const messageFichiers = (manquants) => `il manque ${formaterListe(manquants)}`

    const afficherErreurs = (erreurs) => {
    erreurs.forEach((e) => console.log(`- ${e}`))
    }

    const afficherStatut = (nom, ok) => {
        const icone = ok ? "✅" : "❌"
        console.log(`${icone} dossier du projet ${nom}`)
    }

    let projetsCorrects = 0

    track.projects.forEach((projet) => {
        const cheminProjet = join(cheminDossier, projet.name)

        const dossierExiste = existsSync(cheminProjet)
        const gitOk = existsSync(join(cheminProjet, ".git"))
        const manquants = projet.required.filter((f) => !existsSync(join(cheminProjet, f)))

        const ok = dossierExiste && gitOk && manquants.length === 0
        afficherStatut(projet.name, ok)

        const erreurs = []
        if (!dossierExiste) {
            erreurs.push("le dossier n'existe pas ou n'est pas nommé correctement")
        } else {
            if (!gitOk) erreurs.push("le repository git n'est pas initialisé")
            if (manquants.length > 0) erreurs.push(messageFichiers(manquants))
        }
        afficherErreurs(erreurs)

        if (ok) projetsCorrects++
    })

    // TODO : calculer et afficher le pourcentage de projets corrects
    const afficherPourcentage = (ok, total) => {
        const pourcent = Math.round((ok / total) * 100)
        const icone = ok === total ? "✅" : "❌"
        console.log(`${icone} ${pourcent}% des projets sont initialisés correctement (${ok}/${total})`)
    }
    afficherPourcentage(projetsCorrects, track.projects.length)
}
else {
    console.log("❌ dossier ~/ada-tech/bloc1/projets")
}