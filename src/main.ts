import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import checkView from 'vue-check-view';
import headroom from 'vue-headroom';

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

Vue.use(checkView);
Vue.use(headroom);

// Initialize the app's store upon first visit to site
router.beforeEach((to, from, next) => {
    if (!store.getters['getAppReady']) {
        store.dispatch('initApp').then(response => {
            next();
        });
    } else {
        next();
    }
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
