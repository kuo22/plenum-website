import Vue from 'vue';
import store from '@/store';
import Router from 'vue-router';
import Home from '@/views/Home';
import TextArticle from '@/views/TextArticle';
import Publication from '@/views/Publication';
import PageView from '@/views/PageView';

// TODO: These aren't views... move them to the components folder

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {

            path: '/publications/:publication',
            name: 'publication-table-of-contents',
            component: Publication,
        },
        {
            // TODO: find way to change component based on parameter/path
            path: '/content/:content_type/:id',
            name: 'publication-article',
            component: TextArticle,
        },
        {
            path: '/about/:theme',
            name: 'about',
            component: PageView,
        },
        {
            path: '/:section/:theme',
            name: 'anything?',
            component: PageView
        },
        {
            path: '/:page',
            name: 'anything-2?',
            component: PageView
        },
    ],
});

// Initialize the app's store on first visit
router.beforeEach((to, from, next) => {
    if (!store.getters['getAppReady']) {
        store.dispatch('initApp').then(response => {
            next();
        });
    } else {
        next();
    }
});

export default router;
