import Vue from 'vue';
import Router from 'vue-router';
import RouterMode from 'vue-router';
import Home from '@/views/Home';
import TableOfContents from '@/views/TableOfContents';
import TextArticle from '@/views/TextArticle';
import Publication from '@/views/Publication';

// TODO: These aren't views... move them to the components folder

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
            path: '/pubs/:id/toc',
            name: 'table-of-contents',
            component: TableOfContents,
        },
        {
            path: '/pubs/:id/:article_id',
            name: 'text-article',
            component: TextArticle,
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
    ],

});
