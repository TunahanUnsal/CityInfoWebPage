<template>
  <section class="container">
    <form @submit="search">
      <label for="city">Hava durumunu öğrenmek istediğiniz şehri yazın.</label>
      <div class="input-group">
        <input
          id="city"
          type="search"
          class="form-control"
          v-model="cityName"
        />
        <button type="submit" class="btn btn-primary">ara</button>
      </div>

      <!-- Weather -->
      <div v-if="weather && weather.current">
        <h1>{{ cityName }}</h1>
        <div>Saat Dilimi: {{ weather.timezone }}</div>
        <div>Sıcaklık: {{ weather.current.temp }} &deg;C</div>

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

      <!-- Wiki -->
      <div v-if="wiki">
        {{ wiki.extract }}
      </div>
    </form>
  </section>
</template>

<script>
const apikey = '5407b359d0c26a1a938ec299c8154a83'

export default {
  data() {
    return {
      cityName: 'antalya',
      weather: null,
      wiki: null,
    }
  },
  mounted() {},
  methods: {
    search($event) {
      $event.preventDefault()

      this.weather = null
      this.wiki = null

      this.$axios
        .get('/weather/' + this.cityName)
        .then((result) => {
          console.log(result.data)
          this.weather = result.data

          this.$axios.get('/wiki/' + this.cityName).then((wikiResult) => {
            console.log(wikiResult.data)
            const pages = wikiResult.data && wikiResult.data.query.pages
            const pageKey = Object.keys(pages)[0]
            if (pageKey) this.wiki = pages[pageKey]
          })
        })
        .catch((error) => console.log(error))
    },
  },
}
</script>

<style>
</style>
