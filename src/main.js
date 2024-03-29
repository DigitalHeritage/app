// /src/main.js
import "./jquery";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from 'axios';

require("./assets/digitalheritage.scss");
require("../node_modules/material-design-icons/iconfont/material-icons.css");
import Collections from "../public/collections_vide.json";
import { Icon } from "leaflet";
import i18n from "./i18n";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

console.log("collections", Collections);
let url_collection = "https://demo7.ideesculture.fr/gestion/dh_service.php?"+Date.now();
axios.get(url_collection)
.then(response => {
	// JSON responses are automatically parsed.
	let new_collection = response.data;
	Collections.push(new_collection);
})
.catch(e => {
	this.errors.push(e)
})

Vue.config.productionTip = false;
Vue.prototype.$Collections = Collections;
Vue.prototype.$PremiereOuverture = true;
Vue.prototype.$API_db_is_logged_in = false;
Vue.prototype.$API_db_name = "";

new Vue({
  router,

  data: {
    artworks: Vue.prototype.$Collections,
    PremiereOuverture: Vue.prototype.$PremiereOuverture,
    API_db_is_logged_in: Vue.prototype.$API_db_is_logged_in,
    API_db_name: Vue.prototype.$API_db_name
  },
  methods: {
    saveLocal() {
      //delete the localStorage first to prevent deleted collections to be loaded after
      for (let index = 0; index < localStorage.length; index++) {
        if (localStorage.key(index).startsWith("digitalheritage-collection")) {
          localStorage.removeItem(localStorage.key(index));
        }
      }
      let iterator = 0;
      this.$Collections.forEach(collection => {
        //console.log(collection);
        localStorage.setItem(
          "digitalheritage-collection-" + iterator,
          JSON.stringify(collection)
        );
        iterator++;
      });
    }
  },
  i18n,
  render: h => h(App)
}).$mount("#app");
