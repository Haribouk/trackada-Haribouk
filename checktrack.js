import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { homedir } from "os"
import readline from "readline"


// TODO : charger et parser track.json
const texte = readFileSync("track.json", "utf-8")
const track = JSON.parse(texte)

// TODO : construire le chemin vers ~/ada-tech/bloc1/projets
const cheminDossier = join(homedir(), "ada-tech", "bloc1", "projets")

// TODO : vérifier que ce dossier existe et afficher le résultat
const vert = (texte) => `\x1b[32m${texte}\x1b[0m`
const rouge = (texte) => `\x1b[31m${texte}\x1b[0m`

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

rl.question("Lancer la vérification des projets ? (o/n) ", (reponse) => {
    if (reponse.trim().toLowerCase() === "o") {
        if (existsSync(cheminDossier)) {
            console.log(vert("✅ dossier ~/ada-tech/bloc1/projets"))

            console.log("")
        
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
                const message = ok ? vert(`${icone} dossier du projet ${nom}`) : rouge(`${icone} dossier du projet ${nom}`)
                console.log(message)
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

                console.log("")
            })

            // TODO : calculer et afficher le pourcentage de projets corrects
            const afficherPourcentage = (ok, total) => {
                const pourcent = Math.round((ok / total) * 100)
                const icone = ok === total ? "✅" : "❌"
                const messagePourcent = `${icone} ${pourcent}% des projets sont initialisés correctement (${ok}/${total})`
                console.log(ok === total ? vert(messagePourcent) : rouge(messagePourcent))
            }
            afficherPourcentage(projetsCorrects, track.projects.length)
        } else {
            console.log(rouge("❌ dossier ~/ada-tech/bloc1/projets"))
        }
    } else {
        console.log("Vérification annulée.")
    }
    rl.close()
})