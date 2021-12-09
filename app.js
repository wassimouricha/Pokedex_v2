// comment utiliser fetch api ?
// ici c'est l'outil principal pour utiliser pokeapi
//  res = resultat

//objet du dom
const mainScreen = document.querySelector('.main-screen');
const pokeNom = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeUn = document.querySelector('.poke-type-one');
const pokeTypeDeux = document.querySelector('.poke-type-two');
const pokePoids = document.querySelector('.poke-weight');
const pokeTaille = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const boutonGauche = document.querySelector('.left-button');
const boutonDroit = document.querySelector('.right-button');
//ici j'ai déclaré toutes mes variables et le but de la fonction fetch 
// sera d'integrer les données de l'api dans les variables précédentes

//autres variables

const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
  ];
  let prevUrl = null;
  let nextUrl = null;
  

// fonctions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);


//je vais créer une fonction qui regroupe tout les types pour pouvoir
//  supprimer les classes des types et donc les fonds d'écrans lors de chaques clic 
const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
      mainScreen.classList.remove(type);
    }
  };
  
  // ici dans la fonction fleché on va utiliser un Url à la place d'un propriété
// toute cette fonction fetch sert à prendre les informations de l'api 
    // pour l'integrer au dom , pour la partie gauche du pokedex
const fetchPokeList = url => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const { results, previous, next } = data;
        prevUrl = previous;
        nextUrl = next;
  
        for (let i = 0; i < pokeListItems.length ; i++) {
          const pokeListItem = pokeListItems[i];
          const resultData = results[i];
  
          if (resultData) {
            const { name, url } = resultData;
            const urlArray = url.split('/');
            const id = urlArray[urlArray.length - 2];
            pokeListItem.textContent = id + '. ' + capitalize(name);
          } else {
            pokeListItem.textContent = '';
          }
        }
      });
  };
  // toute cette fonction fetch sert à prendre les informations de l'api 
// pour l'integrer au dom , pour la partie droite du pokedex
  const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => {
        resetScreen();
         //  le [0] prend le 1ere valeur du tableau que infotype va chercher
        //    et [1] la deuxieme
        const dataTypes = data['types'];
        const dataFirstType = dataTypes[0];
        const dataSecondType = dataTypes[1];
        pokeTypeUn.textContent = capitalize(dataFirstType['type']['name']);
        if (dataSecondType) {
          pokeTypeDeux.classList.remove('hide');
          pokeTypeDeux.textContent = capitalize(dataSecondType['type']['name']);
        } else {
          pokeTypeDeux.classList.add('hide');
          pokeTypeDeux.textContent = '';
        }
        mainScreen.classList.add(dataFirstType['type']['name']);
  
        pokeNom.textContent = capitalize(data['name']);
        // tostring permet de transformer en chaine de caractere
        // padstart permet de compléter la chaîne courante avec une chaîne de 
        // caractères donnée afin d'obtenir une chaîne de longueur fixée
        pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
        pokePoids.textContent = data['weight'];
        pokeTaille.textContent = data['height'];
           // L'opérateur OU logique (||) (disjonction logique) renvoie vrai 
        // si et seulement si au moins un de ses opérandes est vrai. 
        pokeFrontImage.src = data['sprites']['front_default'] || '';
        pokeBackImage.src = data['sprites']['back_default'] || '';
      });
  };
  
  const handleLeftButtonClick = () => {
    if (prevUrl) {
      fetchPokeList(prevUrl);
    }
  };
  
  const handleRightButtonClick = () => {
    if (nextUrl) {
      fetchPokeList(nextUrl);
    }
  };
  
  const handleListItemClick = (e) => {
    if (!e.target) return;
//   ! indique si la condition e.target est nulle
    const listItem = e.target;
    if (!listItem.textContent) return;
  
    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
  };
  


    // evenement au clic
    boutonGauche.addEventListener('click', handleLeftButtonClick);
    boutonDroit.addEventListener('click', handleRightButtonClick);
    for (const pokeListItem of pokeListItems) {
      pokeListItem.addEventListener('click', handleListItemClick);
    }
    

    // initialisé l'app

    fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');

