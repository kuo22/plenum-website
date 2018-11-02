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
            path: '/about/:theme',
            name: 'about',
            component: PageView,
        },
        // TODO: reformat to properly decouple, this hard-coding has to be temporary
        {
            path: '/contribute/:theme',
            name: 'contribute',
            component: PageView
        },
        {
            path: '/join-us',
            name: 'join us',
            component: PageView
        },
    ],
});