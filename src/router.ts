import Vue from 'vue';
import Router from 'vue-router';
import RouterMode from 'vue-router';
import Home from './views/Home';
import About from './views/About';
import Menu from './views/Menu';
import ProjectPage from './views/ProjectPage';

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
            path: '/about',
            name: 'about',
            component: About,
        },
        {
            path: '/menu/:filtersList',
            name: 'menu',
            component: Menu,
            props: true,
        },
        {
            path: '/project/:project',
            name: 'project',
            component: ProjectPage,
            props: true,
        },
    ],
});
