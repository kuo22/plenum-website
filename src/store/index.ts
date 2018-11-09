import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {IssuesStoreModule} from '@/store/modules/issues/_store';
import {MenuTreeStoreModule} from '@/store/modules/menuTree/menuTreeModule';
import {RouterNavStoreModule} from '@/store/modules/routerNav/_store';
import {PagesModule} from '@/store/modules/pages/_store';

Vue.use(Vuex);

export interface RootState {
    appReady: boolean;
}

let store = new Vuex.Store<RootState>({
    strict: false,
    //strict: process.env.NODE_ENV !== 'production',
    modules: {
        issues: IssuesStoreModule,
        menuTree: MenuTreeStoreModule,
        routerNav: RouterNavStoreModule,
        pages: PagesModule
    },
    state: {
        appReady: false
    },
    getters: {
        getAppReady: (state) => {
            return state.appReady;
        }
    },
    mutations: { // For synchronous transactions
        setAppReady(state) {
            state.appReady = true;
        }
    },
    actions: { // For asynchronous transactions
        initApp({ commit }) {
            commit('setAppReady');
            return this.dispatch('menuTree/createMenu');
        }
    },
});

export default store;