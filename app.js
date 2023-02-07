const express = require('express')
const {success} = require('./helper.js')
let pokemons = require('./mock-pokemon');

const app = express()
const port = 3000

app.get('/',(req,res) => res.send(' Hello, Express !') )

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

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`)) 