import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import TextArticle from '@/views/TextArticle';
import Publication from '@/views/Publication';
import PageView from '@/views/PageView';

Vue.use(Router);

export default new Router({
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
            path: '/content/:content_type/:id',
            name: 'publication-article',
            component: TextArticle,
        },
        {
            path: '/about/:page',
            name: 'about',
            component: PageView,
        },
        // TODO: reformat to properly decouple, this hard-coding has to be temporary
        {
            path: '/contribute/:page',
            name: 'contribute',
            component: PageView
        },
        {
            path: '/join-us',
            name: 'join us',
            component: PageView
        },
    ],
    // Scroll behavior moving between URLs
    // If new URL visit -> start at top of page
    // If moving forward/backward through page history -> start at previous scroll position
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
});