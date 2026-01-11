import { createApp } from "vue";
import {
  Quasar,
  QLayout,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QPage,
  QPageContainer,
  QCard,
  QForm,
  QInput,
  QSelect,
  QIcon,
  QCardSection,
  QSeparator,
  QSpinner,
  QTd,
  QTable,
  QCardActions,
  QDialog,
  QSpace,
  QTabs,
  QTab,
  QRouteTab,
  QChip,
  ClosePopup,
} from "quasar";
import App from "./App.vue";
import router from "./router";
import "quasar/dist/quasar.css";
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

const app = createApp(App);
app.use(router);
app.use(Quasar, {
  components: {
    QLayout,
    QHeader,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QPage,
    QPageContainer,
    QCard,
    QForm,
    QInput,
    QSelect,
    QIcon,
    QCardSection,
    QSeparator,
    QSpinner,
    QTd,
    QTable,
    QCardActions,
    QDialog,
    QSpace,
    QTabs,
    QTab,
    QRouteTab,
    QChip,
  },
  directives: {
    ClosePopup,
  },
  plugins: {},
  config: {
    dark: "auto",
  },
});
app.mount("#app");
