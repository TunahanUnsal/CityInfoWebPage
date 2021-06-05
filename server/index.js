
const express = require('express')
const consola = require('consola')
const axios = require('axios')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')


const apikey = "5407b359d0c26a1a938ec299c8154a83";

app.get("/weather/:city", (req, res) => {
  const q = req.params.city;
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apikey}`)
    .then((currentWeather) => {
      const lat = currentWeather.data.coord.lat;
      const lon = currentWeather.data.coord.lon;
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric&lang=tr`)
        .then((onecall) => {
          res.status(200).json(onecall.data).end();
        })
        .catch((error) => res.status(200).json(error).end());
    })
    .catch((error) => res.status(500).json(error).end());
});

app.get("/wiki/:city", (req, res) => {
  const q = req.params.city;
  axios.get(`https://tr.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&redirects&titles=${q}`)
    .then((result) => {
      res.status(200).json(result.data).end();
    })
    .catch((error) => res.status(500).json(error).end());
});

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
