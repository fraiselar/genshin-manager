# Audit de Fraise.xlsx — Semaine 1

## 1. Ce que contient vraiment le fichier

| Feuille | Contenu réel |
|---|---|
| **Pulls** | 4 blocs côte à côte : Perso (A–G), Chronique (J–P), Arme (S–Y), Standard (AB–AF). + un bloc **Selector** (AI–AL) pour les persos obtenus hors bannière (anniversaires). |
| **Characters** | 47 persos en colonnes (B–AV). Lignes : Cons Needed (3), Current Cons (4, formule), R Needed (5), Current R (6, **saisi à la main**), Skin (7), Done? (8), Pulls dépensés (9), lignes de calcul 100–101. |
| **Data** | 8 persos standards, 10 armes standards ; 2 plages nommées. |
| **Stats** | Total / limité / standard (3 formules). |
| **Feuille 1** | Dashboard : besoins restants, estimation de vœux, primos, coût des skins en Welkins/€. |

Données actuelles : 3 5★ limités (Vesna pity 80, Keqing pity 55 perdu face à Vodyanitsa, Vodyanitsa pity 2), 1 5★ standard (Tighnari pity 21), 0 chronique, 0 arme, 3 sélecteurs (Mona, Yumemizuki Mizuki, Chiori). Objectifs non nuls : Navia, Chiori, Arlecchino, Hu Tao, Clorinde, Lyney.

## 2. Règles à reproduire (déjà codées et testées dans `src/domain`)

1. **50/50** : item dans la liste standard → `lose` ; sinon, précédent = `lose` → `guaranteed` ; sinon `win`. La garantie se propage dans la même bannière.
2. **Streak signé** : win → +1 (ou 1 si on était en négatif) ; guaranteed → inchangé ; lose → −1 (ou −1 si on était en positif).
3. **Win rate** = win / (win + lose) ; les `guaranteed` sont exclus.
4. **Total vœux** = somme des pity ; primos = vœux × 160.
5. **Constellation actuelle** = nombre d'exemplaires − 1, sur 4 sources : bannière perso, chronique, standard, sélecteur (−1 = non possédé).
6. **Pulls dépensés pour un perso** = pity de ses 5★ + pity des 50/50 perdus face à lui.
7. **Dashboard** : copies restantes = Σ(consNeeded+1) − copies obtenues (plafonnées à l'objectif) ; raffinements restants = ΣR needed − ΣCurrent R ; skins : 1680 cristaux/skin → /300 arrondi au sup. = Welkins → ×5 €.

## 3. Bugs et ambiguïtés repérés

1. **Chronique (col. L)** : les références `Data!K2:V2`, `K3:V3`… *dérivent d'une ligne à chaque ligne* (et pointent la ligne des armes standards). La colonne P teste `"No"` alors que L produit `"Lose"` → les séries négatives ne sont jamais calculées.
2. **Standard (col. AD)** : la colonne « patch » contient des restes de formules 50/50, dont `#REF!`.
3. **« Done? »** (`B3−B4+B5−B6=0`) : les écarts se compensent (ex. C2 obtenu pour un objectif C0 → « No ») et le skin est ignoré. Remplacé par `isGoalComplete`.
4. **Plages nommées** : `standardcharacter` = `Data!A1:K1` et `standardweapons` = `Data!A2:R2` incluent la cellule-label ; la colonne C utilise `Data!$B$1:$M$1` à la place → deux sources pour la même liste.
5. **Typo** « Guaranted » utilisée comme valeur dans les formules (`COUNTIF`). Dans l'app : `guaranteed`.
6. **G8 = 1 en dur** (amorce de streak), `Stats!B2` additionne une cellule vide (B5), plages limitées à la ligne 1000.
7. **Fonctions Google** : `SPARKLINE` (export `__xludf.DUMMYFUNCTION`) et `VOEUX_PERSO_GAGNES` / `VOEUX_ARMES_GAGNEES` (Apps Script, *absents du .xlsx* → `#VALUE!` hors Google Sheets).
8. **Current R saisi à la main** : les pulls d'armes ne l'alimentent pas ; aucun lien arme ↔ perso.
9. **Colonne A de Feuille 1** : valeurs en dur sans libellé (0,9 / 5750 / 685 / « Current pity »).

## 4. Questions à trancher avant la semaine 2

- **Q1 — Chronique** : quelle règle exacte (win/lose/garantie) veux-tu ? Le bloc est vide dans ton fichier, je ne peux pas la déduire.
- **Q2 — Projections** : peux-tu me donner le code Apps Script de `VOEUX_PERSO_GAGNES` et `VOEUX_ARMES_GAGNEES` (Google Sheets → Extensions → Apps Script) ? Ils servent de référence pour la semaine 8.
- **Q3 — Skin** : `1` veut-il dire « skin voulu / à acheter » ou « possédé » ? Le dashboard compte `1` comme un coût à payer.
- **Q4 — Feuille 1, colonne A** : à quoi correspondent 0,9, 5750 et 685 ?
- **Q5 — Armes** : veux-tu lier chaque arme signature à son perso pour déduire `Current R` des tirages ?
- **Q6 — Radiance / règles d'armes** : ton Excel ne distingue pas un win « normal » d'un win par garantie de radiance, ni les règles spécifiques de la bannière arme. Tu veux les modéliser ou rester fidèle à l'Excel ?
