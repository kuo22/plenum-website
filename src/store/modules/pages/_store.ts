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
                .then(frontPages => {
                    frontPages.forEach(page => {
                        commit('addPage', page);
                    });
                });
        },
    }
};