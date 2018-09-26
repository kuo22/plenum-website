import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {IssuesStoreModule} from '@/store/modules/issues/_store';
import {MenuTreeModule} from '@/store/modules/menuTree/menuTreeModule';

Vue.use(Vuex);

export interface RootState {

}

export default new Vuex.Store<RootState>({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        issues: IssuesStoreModule,
        menuTree: MenuTreeModule
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