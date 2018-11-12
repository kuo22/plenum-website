import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import checkView from 'vue-check-view';
import headroom from 'vue-headroom';

Vue.config.productionTip = false;

// Add keycode specific events to app for accessibility navigation
const alphabetCodes: number[] = [];
for (let i = 48; i <= 90; i++) {
    alphabetCodes.push(i);
}
Vue.config.keyCodes = {
    home: 36,
    end: 35,
    alphabet: alphabetCodes,
};

Vue.use(checkView);
Vue.use(headroom);

// Initialize the app's store upon first visit to site before routing to a component
router.beforeEach((to, from, next) => {
    if (!store.getters['getAppReady']) {
        store.dispatch('initApp').then(response => {
            next();
        });
    } else {
        next();
    }
});

// Change the app's title based on route
router.afterEach((to, from) => {
    const name = to.name;
    if (name.includes('article')) {
        // Defer to TextArticle view
    } else if (name.includes('publication')) {
        window.document.title = process.env.VUE_APP_TITLE.toUpperCase() + " JOURNAL";
    } else {
        window.document.title = process.env.VUE_APP_TITLE.toUpperCase() + " | " + name.toUpperCase();
    }
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
