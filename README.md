# Orbitoile — Spatial Portfolio

Portfolio expérimental indépendant du site principal Orbitoile.

## Stack
- HTML, CSS et JavaScript natifs
- Three.js pour la scène 3D d'ouverture (ORBI, Terre, atmosphère, nuages et champ d'étoiles)
- Canvas 2D pour le champ d'étoiles discret de la page
- Google Fonts (Manrope, DM Mono)

## Lancer en local
Ouvrir le dossier avec un serveur HTTP local (par exemple l'extension Live Server de VS Code). Le module Three.js est chargé depuis esm.sh ; une ouverture directe en `file://` peut bloquer les modules ou certaines ressources.

## Publication GitHub Pages
Dans le dépôt : **Settings → Pages → Deploy from a branch → main → / (root) → Save**.

URL attendue :
`https://orbitoile.github.io/orbitoile-portfolio/`

## À vérifier avant présentation publique
- Contrôler le rendu réel de l'introduction dans Chrome, Firefox et sur mobile.
- Tester le chargement des textures de la Terre et le comportement si WebGL est indisponible.
- Remplacer/compléter les visuels de projets par des captures réelles autorisées.
- Ajouter les études de cas détaillées et les informations vérifiées.
- Tester les liens, l'accessibilité clavier et les performances.
- Vérifier les coordonnées de contact et les mentions légales.
- Confirmer l'activation de GitHub Pages et l'URL de publication.
