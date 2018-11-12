import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home';
import TextArticle from '@/views/TextArticle';
import Publication from '@/views/Publication';
import PageView from '@/views/PageView';
import NotFoundView from '@/views/NotFoundView';
import About from '@/views/About';
import Contribute from '@/views/Contribute';

import vueConfig from '../vue.config.js';

Vue.use(Router);

export default new Router({
    base: vueConfig.baseUrl,
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/about',
            name: 'about',
            component: About,
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
        // TODO: reformat to properly decouple, this hard-coding has to be temporary
        {
            path: '/contribute',
            name: 'contribute',
            component: Contribute
        },
        {
            path: '/join-us',
            name: 'join us',
            component: PageView
        },
        {
            path: '*',
            component: NotFoundView
        }
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