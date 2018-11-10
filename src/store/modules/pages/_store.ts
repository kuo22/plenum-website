import {Module} from "vuex";

import {RootState} from "@/store";
import api from '@/lib/api';

interface PagesState {
    pages: Array<any>;
}

export const PagesModule: Module<PagesState, RootState>  = {
    namespaced: true,
    state: {
        pages: []
    },
    getters: {
        getFrontPage: (state) => {
            return state.pages.filter(page => page.promote);
        },
        getAboutPage: (state) => {
            return state.pages.filter(page => page.title.startsWith('About'));
        },
        getContributePage: (state) => {
            return state.pages.filter(page => page.title.includes('Submission'));
        },
        getPages: (state) => {
            return state.pages;
        }
    },
    mutations: {
        addPage(state, newPage: any) {
            if (!state.pages.some(existingPage => existingPage.uuid === newPage.uuid)){
                state.pages.push(newPage);
            }
        }
    },
    actions: {
        // TODO: universalize initialization to prepare for promotion of all content types
        initFrontPage({ commit }) {
            return api.fetchFrontPage()
                .then(pages => {
                    pages.forEach(page => {
                        commit('addPage', page);
                        commit('setAppLoading', false, {root: true});
                    });
                });
        },
        initAboutPage({ commit }) {
            return api.fetchAboutPage()
                .then(pages => {
                    pages.forEach(page => {
                        commit('addPage', page);
                        commit('setAppLoading', false, {root: true});
                    });
                });
        },
        initContributePage({ commit }) {
            return api.fetchContributePage()
                .then(pages => {
                    pages.forEach(page => {
                        commit('addPage', page);
                        commit('setAppLoading', false, {root: true});
                    });
                });
        },
        fetchPage({ commit }, uuid: string) {
            return api.findPageByUUID(uuid)
                .then(page => {
                    commit('addPage', page);
                    commit('setAppLoading', false, {root: true});
                });
        }
    }
};