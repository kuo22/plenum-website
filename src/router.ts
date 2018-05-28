import Vue from 'vue';
import Router from 'vue-router';
import RouterMode from 'vue-router';
import Home from '@/views/Home';
import TableOfContents from '@/views/TableOfContents';
import Article from '@/views/Article';
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
            name: 'article',
            component: Article,
        },
    ],

});
