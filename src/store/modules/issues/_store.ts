import {Module} from "vuex";

import {RootState} from "@/store";
import {Article, Collection} from '@/types/types';

interface IssuesState {
    issues: Array<Collection>; // Key is JSON API ID ("081b98ba-4ec8-429d-9152-2c231f45885a")
    articles: Array<any>;
}

export const IssuesStoreModule: Module<IssuesState, RootState>  = {
    namespaced: true,
    state: {
        issues: [],
        articles: []
    },
    getters: {
        getIssue: (state) => (article: Article) => {
            return state.issues.find((issue: Collection) => {
                return issue.articles.some((art: Article) => {
                    return art.uuid == article.uuid;
                });
            });
        },
        // TODO: return article with issue information?
        getArticleByUUID: (state) => (uuid: string) => {
            return state.articles.find((article: any) => article.uuid === uuid);
        }
    },
    mutations: {
        addIssue(state, issue: Collection) {
            let tempIssues = [...state.issues];
            tempIssues.push(issue);

            // TODO: This is returning a warning...
            state.issues = tempIssues.sort((issueA, issueB) => {
                return issueA.datePublished.split('T')[0] < issueB.datePublished.split('T')[0] ? -1: 1;
            });
        },

        addArticle(state, article: Object) {
            state.articles.push(article);
        }
    },
    actions: {
        addIssue({ commit }, issue: Collection) {
            commit('addIssue', issue);
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