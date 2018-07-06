import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import {StoreOptions} from 'vuex';
import Vuex from 'vuex';
import {RootState} from '@/types/storeTypes';
import {index} from '@/store/modules/profile/profile';

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
