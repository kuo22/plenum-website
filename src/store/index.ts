import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {IssuesStoreModule} from '@/store/modules/issues/_store';
import {MenuTreeStoreModule} from '@/store/modules/menuTree/menuTreeModule';
import {RouterNavStoreModule} from '@/store/modules/routerNav/_store';

Vue.use(Vuex);

export interface RootState {

}

export default new Vuex.Store<RootState>({
    strict: false,
    //strict: process.env.NODE_ENV !== 'production',
    modules: {
        issues: IssuesStoreModule,
        menuTree: MenuTreeStoreModule,
        routerNav: RouterNavStoreModule
    },
    state: {

    },
    getters: {

    },
    mutations: { // For synchronous transactions

    },
    actions: { // For asynchronous transactions

    },
});