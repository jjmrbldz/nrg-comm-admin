import 'video.js/dist/video-js.css'
import './assets/css/style.scss'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import '@mdi/font/css/materialdesignicons.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import DialogService from 'primevue/dialogservice'
import DynamicDialog from 'primevue/dynamicdialog'
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Ripple from "primevue/ripple"
import MeterGroup from 'primevue/metergroup'
import Editor from 'primevue/editor';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmPopup from 'primevue/confirmpopup';

import GF from '@/utils/GlobalFunctions'
import MODAL from '@/components/Modals'

import StatusTag from '@/components/GlobalComponents/StatusTag.vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(DialogService);
app.component('Toast', Toast)
app.component('DynamicDialog', DynamicDialog)
app.component('Editor', Editor)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('StatusTag', StatusTag)
app.component('MeterGroup', MeterGroup)
app.component('ConfirmPopup', ConfirmPopup)
app.use(ConfirmationService);

app.directive('ripple', Ripple)

app.config.globalProperties.$GF = GF; // GlobalFunctions.js
app.config.globalProperties.$modalComponent = MODAL;

app.mount('#app')
