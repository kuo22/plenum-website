import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import {IssuesStoreModule} from '@/store/modules/issues/_store';
import {MenuTreeStoreModule} from '@/store/modules/menuTree/menuTreeModule';
import {RouterNavStoreModule} from '@/store/modules/routerNav/_store';
import {PagesModule} from '@/store/modules/pages/_store';

Vue.use(Vuex);

export interface RootState {
    appReady: boolean;
    appLoading: boolean;
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
        appReady: false,
        appLoading: true,
    },
    getters: {
        getAppReady: (state) => {
            return state.appReady;
        },
        appLoading: (state) => {
            return state.appLoading;
        }
    },
    mutations: { // For synchronous transactions
        setAppReady(state) {
            state.appReady = true;
        },
        setAppLoading(state, bool) {
            state.appLoading = bool;
        }
    },
    actions: { // For asynchronous transactions
        initApp({ commit }) {
            commit('setAppReady');
            return this.dispatch('menuTree/createMenu');
        },
        setAppLoading({ commit }, bool) {
            commit('setAppLoading', bool);
        }
    },
});

export default store;