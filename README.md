# DALF C1 — Argumentation oral & écrit

Plateforme pédagogique statique conçue pour préparer conjointement l'essai argumenté et l'exposé du DALF C1.

## Principe

Une ressource argumentative commune par thème, puis deux transformations :

- **ESSAI** : convaincre un lecteur dans une situation d'écriture ;
- **EXPOSÉ** : conduire un auditeur dans un raisonnement à partir de documents.

Chaîne de préparation : **THÈME → PROBLÉMATIQUE → POSITION → AXES → ARGUMENT → JUSTIFICATION → EXEMPLE → OBJECTION → CONCESSION → RÉPONSE**.

## Pages

- `index.html` — accueil
- `methode.html` — méthode commune oral/écrit
- `dossiers.html` — index des 10 dossiers
- `dossier.html?id=D01` — page dynamique d'un dossier
- `sujets.html` — banque filtrable de sujets oral/écrit
- `methodes.html` — **À consulter dans les méthodes** : bibliothèque de méthodes de français indexées
- `methode-livre.html?id=cosmopolite5` — page dynamique d'une méthode
- `grille.html` — mots-clés de la grille C1
- `fiche.html` — fiche de préparation imprimable, avec une rubrique de récolte dans les méthodes

## Ressources issues des méthodes

Les méthodes de français servent de ressources complémentaires aux 10 dossiers d'argumentation. Chaque repère est rattaché à un dossier DALF et précise : unité/pages, thèmes à travailler et éléments à relever.

La structure est extensible : les nouvelles méthodes sont ajoutées dans `data/methodes.js` sans modifier l'architecture du site.

La récolte proposée aux étudiants est commune à toutes les méthodes :

- 8 expressions utiles ;
- 2 arguments transférables ;
- 2 exemples ;
- 1 objection / réserve ;
- 2 formulations de nuance.

La première méthode indexée est **Cosmopolite 5 (C1–C2, Hachette FLE)**, avec une **Boîte à outils — Cosmopolite 5** pour les pages de stratégies transversales.

## Déploiement GitHub Pages

Le site est 100 % statique (HTML/CSS/JS), sans dépendance ni étape de compilation. Il peut être publié directement depuis la branche `main` avec GitHub Pages.
