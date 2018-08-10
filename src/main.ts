import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import {StoreOptions} from 'vuex';
import Vuex from 'vuex';
import {RootState} from '@/types/storeTypes';
// import {index} from '@/store/modules/menuTree/menuTree';

Vue.config.productionTip = false;

const alphabet: number[] = [];
for (let i = 48; i <= 90; i++) {
    alphabet.push(i);
}

Vue.config.keyCodes = {
    home: 36,
    end: 35,
    alphabet,
};

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
