# AnimeSync-Extension

## Introduction

AnimeSync Extension est une extension de navigateur qui permet aux utilisateurs de synchroniser leur expérience de streaming d'anime sur plusieurs sites avec d'autres en temps réel.

## Explication du projet

AnimeSync-Extension est une extension web qui utilise WebSockets pour établir une connexion en temps réel entre les utilisateurs qui regardent le même épisode d'anime.

## Fonctionnalités

* Synchronisation en temps réel du streaming d'anime
* Prise en charge de plusieurs lecteurs sur différents sites :
    + Anime-sama.fr :
        - [x] (1) Vidmoly
        - [x] (2) Video.sibnet
        - [x] (3) Sendvid
    + Voiranime.com :
        - [x] MyTV (vidmoly)
        - [ ] ~~MOON (non supporté)~~
        - [x] VOE (richardstorehalf)
        - [x] Stape (streamstape)

## Installation

### Option 1 : Télécharger le fichier .crx

1. Allez à la page des [dernières versions](https://github.com/daisseur/AnimeSync-Extension/releases/latest).
2. Téléchargez le fichier `ext.crx`.
3. Allez à la page des extensions Chrome en tapant `chrome://extensions/` dans la barre d'adresse.
4. Activez le mode développeur.
5. Faites glisser et déposez le fichier `AnimeSync-Extension.crx` sur la page des extensions.

### Option 2 : Télécharger le référentiel

1. Clonez le référentiel en utilisant `git clone https://github.com/daisseur/AnimeSync-Extension.git`.
2. Téléchargez le référentiel sous forme de fichier zip depuis la page GitHub.
3. Allez à la page des extensions Chrome en tapant `chrome://extensions/` dans la barre d'adresse.
4. Activez le mode développeur.
5. Cliquez sur "Charger non empaqueté" et sélectionnez le dossier `ext` du référentiel.

## Utilisation

1. Installez l'extension en utilisant l'une des méthodes ci-dessus.
2. Allez sur un site supporté et commencez à regarder un épisode d'anime avec un lecteur supporté.
3. Cliquez sur l'icône de l'extension dans le coin supérieur droit du navigateur.
4. Entrez l'ID de la salle ou créez une nouvelle salle.
5. Commencez à regarder et profitez de l'expérience de synchronisation avec d'autres !

## Serveur

Par défaut, l'extension utilise le serveur `aserver.daisseur.online`. Cependant, les utilisateurs avancés peuvent personnaliser le serveur en modifiant les paramètres `host` et `port` dans les options de l'extension.

## Lancement du serveur

Pour lancer le serveur, vous devez suivre les étapes suivantes :

1. Installez les dépendances en exécutant `npm i` dans le répertoire du serveur.
2. Lancez le serveur en exécutant `npm run dev`.
> __Note:__ Vous pouvez aussi très bien utiliser `deno`
