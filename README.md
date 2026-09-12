# DALF C1 — Argumentation oral & écrit

Plateforme pédagogique statique conçue pour préparer conjointement l'essai argumenté et l'exposé du DALF C1.

## Principe

Une ressource argumentative commune par thème, puis deux transformations :

- **ESSAI** : convaincre un lecteur dans une situation d'écriture ;
- **EXPOSÉ** : conduire un auditeur dans un raisonnement à partir de documents.

Chaîne de préparation : **THÈME → PROBLÉMATIQUE → POSITION → AXES → ARGUMENT → JUSTIFICATION → EXEMPLE → OBJECTION → CONCESSION → RÉPONSE**.

## Pages

- `index.html` — accueil
- `methode.html` — **Stratégies** communes oral/écrit
- `dossiers.html` — index des 10 dossiers
- `dossier.html?id=D01` — page dynamique d'un dossier
- `sujets.html` — banque filtrable de sujets oral/écrit
- `methodes.html` — **À consulter dans les méthodes** : bibliothèque de méthodes de français indexées
- `methode-livre.html?id=cosmopolite5` — page dynamique d'une méthode
- `entrainements.html` — banque des entraînements DALF repérés dans les méthodes
- `entrainement.html?id=c5-dalf6-tourisme` — fiche d'un entraînement avec repères et corrigé pédagogique quand disponible
- `grille.html` — mots-clés de la grille C1
- `fiche.html` — fiche de préparation imprimable, avec une rubrique de récolte dans les méthodes

## Ressources issues des méthodes

Les méthodes de français servent de ressources complémentaires aux 10 dossiers d'argumentation. Chaque repère est rattaché à un dossier DALF et précise : unité/pages, thèmes à travailler et éléments à relever.

La structure est extensible : les nouvelles méthodes sont ajoutées dans `data/methodes.js` et les entraînements dans `data/entrainements.js`, sans modifier l'architecture générale du site.

La récolte proposée aux étudiants est commune à toutes les méthodes :

- 8 expressions utiles ;
- 2 arguments transférables ;
- 2 exemples ;
- 1 objection / réserve ;
- 2 formulations de nuance.

La première méthode indexée est **Cosmopolite 5 (C1–C2, Hachette FLE)**, avec une **Boîte à outils — Cosmopolite 5** pour les pages de stratégies transversales.

## Entraînements DALF

La plateforme distingue les sujets d'examen recensés dans le corpus et les entraînements proposés dans les méthodes. Les exercices des manuels sont indexés par méthode, niveau, compétence et dossier thématique. Les sujets et documents complets restent dans les ouvrages d'origine ; le site fournit des repères de pages, le type de corrigé disponible et, pour certains exercices, une reformulation pédagogique du corrigé.

## Déploiement GitHub Pages

Le site est 100 % statique (HTML/CSS/JS), sans dépendance ni étape de compilation. Il peut être publié directement depuis la branche `main` avec GitHub Pages.
