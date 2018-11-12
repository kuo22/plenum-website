import {Module} from "vuex";

import {RootState} from "@/store";

interface IssuesState {
    collections: Array<any>; // Key is JSON API ID ("081b98ba-4ec8-429d-9152-2c231f45885a")
    articles: Array<any>;
}

export const IssuesStoreModule: Module<IssuesState, RootState>  = {
    namespaced: true,
    state: {
        collections: [],
        articles: []
    },
    getters: {
        getIssue: (state) => (article: any) => {
            return state.collections.find((collection: any) => {
                return collection.articles.some((checkingArticle: any) => {
                    return checkingArticle.uuid == article.uuid;
                });
            });
        },
        // TODO: return article with collection information?
        getArticleByUUID: (state) => (uuid: string) => {
            return state.articles.find((article: any) => article.uuid === uuid);
        }
    },
    mutations: {
        addIssue(state, collection: any) {
            let tempIssues = [...state.collections];
            tempIssues.push(collection);

            // TODO: This is returning a warning...
            state.collections = tempIssues.sort((collectionA, collectionB) => {
                return collectionA.datePublished.split('T')[0] < collectionB.datePublished.split('T')[0] ? -1: 1;
            });
        },

        addArticle(state, article: Object) {
            state.articles.push(article);
        }
    },
    actions: {
        addIssue({ commit }, collection: any) {
            commit('addIssue', collection);
            commit('setAppLoading', false, {root: true});
        },

        addArticle({ commit, state }, article: any) {
            // If article does not already exist in store
            if (!state.articles.find((storeArticle: any) => storeArticle.uuid === article.uuid)) {
                article.active = false;
                commit('addArticle', article);
                commit('setAppLoading', false, {root: true});
            }
        }
    }
};