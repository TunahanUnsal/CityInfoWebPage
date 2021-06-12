<template>
  <div id="CityWeather" :class="{ results: weather && weather.current }">
    <!-- Search Box -->
    <div class="top-div container">
      <form @submit="submit">
        <div class="input-group">
          <input
            id="city"
            type="search"
            class="form-control form-control-lg"
            placeholder="Bir şehir ismi yazınız"
            v-model="cityName"
            autocomplete="off"
          />
          <button type="submit" class="btn btn-lg btn-secondary">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </form>
      <div class="searchlist" v-if="searchList">
        <h3>En çok aranan şehirler</h3>
        <div>
          <a
            href="#"
            @click="getWeather(item.city)"
            v-for="item in searchList"
            :key="item.city"
          >
            {{ item.city }} ({{ item.count }}),
          </a>
        </div>
      </div>
    </div>

    <!-- Weather Results -->
    <div class="container" v-if="weather && weather.current">
      <!-- Weather -->
      <h1 class="capitalize">{{ searchCity }}</h1>
      <div>Saat Dilimi: {{ weather.timezone }}</div>
      <div>Sıcaklık: {{ Math.round(weather.current.temp) }} &deg;C</div>

      <!-- Daily -->
      <div class="margin" v-if="weather && weather.daily">
        <div class="row">
          <div class="col" v-for="(day, $index) in weather.daily" :key="$index">
            <div v-html="formatDate(day.dt)"></div>
            <img :src="weatherIcon(day.weather[0].icon)" alt="" />
            <div class="temp">
              {{ Math.round(day.temp.min) }} ~
              {{ Math.round(day.temp.max) }} &deg;C
            </div>
            <div class="description capitalize">
              {{ day.weather[0].description }}
            </div>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div id="Map">
        <iframe
          width="100%"
          height="300"
          frameborder="0"
          scrolling="no"
          marginheight="0"
          marginwidth="0"
          :src="`https://maps.google.com/maps?q=${cityName}&hl=tr&z=14&output=embed`"
        >
        </iframe>
      </div>

      <div class="row">
        <div class="col-md">
          <!-- Wiki -->
          <div id="Extract" v-if="wiki">
            {{ wiki.extract }}
          </div>
        </div>

        <div class="col-md">
          <!-- Wiki Images -->
          <div id="Slider" v-if="wikiImages">
            <b-carousel
              id="carousel-1"
              v-model="slide"
              :interval="4000"
              controls
              indicators
              background="#ababab"
              style="text-shadow: 1px 1px 2px #333"
            >
              <!-- Text slides with image -->
              <b-carousel-slide
                v-for="(image, $index) in wikiImages"
                :key="$index"
                :caption="imageCaption(image.title)"
                :img-src="
                  image.imageinfo &&
                  image.imageinfo[0] &&
                  image.imageinfo[0].thumburl
                "
              ></b-carousel-slide>
            </b-carousel>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const apikey = '5407b359d0c26a1a938ec299c8154a83'

import '@fortawesome/fontawesome-free/css/all.css'
import moment from 'moment/dist/moment'
import 'moment/dist/locale/tr'

export default {
  data() {
    return {
      cityName: '',
      searchCity: '',
      searchList: null,
      weather: null,
      wiki: null,
      wikiImages: null,
      slide: null,
    }
  },
  mounted() {
    this.getSearchList()
  },
  methods: {
    submit($event) {
      $event.preventDefault()
      this.getWeather(this.cityName)
    },
    getWeather(city) {
      this.weather = null
      this.wiki = null

      this.$axios
        .get('/weather/' + city)
        .then((result) => {
          this.searchCity = city
          console.log(result.data)
          this.weather = result.data

          this.$axios.get('/wiki/' + city).then((wikiResult) => {
            console.log(wikiResult.data)
            const pages = wikiResult.data && wikiResult.data.query.pages
            const pageKey = Object.keys(pages)[0]
            if (pageKey) this.wiki = pages[pageKey]
          })

          this.$axios.get('/images/' + city).then((imagesResult) => {
            console.log(imagesResult.data)
            this.wikiImages = imagesResult.data.query.pages
          })

          this.getSearchList()
        })
        .catch((error) => console.log(error))
    },
    getSearchList() {
      this.$axios.get('/cities').then((result) => {
        console.log(result.data)
        this.searchList = result.data.cities
      })
    },
    imageCaption(title) {
      return title.split(':')[1].split('.')[0]
    },
    formatDate(unix_timestamp) {
      var d = new Date(unix_timestamp * 1000) // unix_timestamp
      return moment(d).format('MMMM D,<br/> dddd')
    },
    weatherIcon(code) {
      return 'https://openweathermap.org/img/wn/' + code + '@2x.png'
    },
  },
}
</script>

<style>
html,
body {
  height: 100%;
}

body {
  background: url('~/assets/wallpaper.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #ffffff;
}

#CityWeather {
  transition: padding linear 300ms;
}

#CityWeather.results .top-div {
  padding-top: 5%;
  padding-bottom: 5%;
}

#CityWeather:not(.results) .top-div {
  padding-top: 20%;
  padding-bottom: 20%;
}

#Map,
#Slider {
  margin-top: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

#Extract {
  font-size: 16px;
  font-weight: bold;
  text-align: justify;
  margin-top: 15px;
}

.capitalize {
  text-transform: capitalize;
}

.margin {
  margin-top: 20px;
  margin-bottom: 20px;
}

.searchlist {
  margin-top: 50px;
  text-align: center;
}
.searchlist a {
  text-transform: capitalize;
}
</style>
