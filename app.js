const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const{Sequelize} = require('sequelize')
const {success, getUniqueId} = require('./helper.js')
let pokemons = require('./mock-pokemon');

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    '',
    {
        host: 'locahost',
        dialect:'mariadb',
         dialectOptions:{
            timezone: 'Etc/GMT-2'
         },
         logging: false
    }
)

sequelize.authenticate()
    .then(_ =>console.log('la connection à la base de donnée à été bien établie.'))
    .catch(error => console.error(` impossible de se connecter à la base de donnée. ${error}`))
app
    .use(favicon('./favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
 
app.get('/',(req,res) => res.send(' Hello, Express !'))

app.get('/api/pokemons/:id',(req,res) => {
    const id =parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokemon a bien été trouvé.'
    res.json(success(message, pokemon))
})
// Point de terminaison affichant tous les pokemons 
app.get('/api/pokemons',(req,res) => {
    const message = 'Tous les pokemons ont été bien affichés.'
    res.json(success(message, pokemons))
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`
    res.json(success(message, pokemonCreated))
 })

   
 app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const pokemonUpdated = { ...req.body, id: id }
    pokemons = pokemons.map(pokemon => {
     return pokemon.id === id ? pokemonUpdated : pokemon
    })
     
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))

});

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
  });

app.listen(port, () => 
console.log(`Notre application Node est démarrée sur : http://localhost:${port}`)) 