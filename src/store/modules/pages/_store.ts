import {Module} from "vuex";

import {RootState} from "@/store";
import APIService from '@/API';

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
            return state.pages.filter(page => page.promoted);
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
        // addIssue(state, issue: Collection) {
        //     let tempIssues = [...state.issues];
        //     tempIssues.push(issue);
        //
        //     state.issues = tempIssues.sort((issueA, issueB) => {
        //         return issueA.datePublished.split('T')[0] < issueB.datePublished.split('T')[0] ? -1: 1;
        //     });
        // },
        //
        // addArticle(state, article: Object) {
        //     state.articles.push(article);
        // }
    },
    actions: {
        async initFrontPage({ commit }) {
            let frontPages = await APIService.fetchFrontPage()
                .then(frontPageData => {
                    return frontPageData.map(pageData => {
                        return {
                            uuid: pageData.uuid[0].value,
                            node: pageData.nid[0].value,
                            title: pageData.title[0].value,
                            body: pageData.body,
                            type: pageData.type[0].target_id,
                            promoted: pageData.promote[0].value
                        }
                    });
                });

            frontPages.forEach(page => {
                commit('addPage', page);
            });
        },
        async getPage({ commit }, node) {
            let page = await APIService.fetchPageByNode(node)
                .then(pageData => {
                    // TODO: redundancy
                    return {
                        uuid: pageData.uuid[0].value,
                        node: pageData.nid[0].value,
                        title: pageData.title[0].value,
                        body: pageData.body,
                        type: pageData.type[0].target_id,
                        promoted: pageData.promote[0].value
                    }
                });

            commit('addPage', page);
        }
    }
};