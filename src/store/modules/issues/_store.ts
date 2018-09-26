import Vue from "vue";
import {Module} from "vuex";

import {RootState} from "@/store";
import {Article, Collection} from '@/types/types';


interface IssuesState {
    issues: Array<Collection>; // Key is JSON API ID ("081b98ba-4ec8-429d-9152-2c231f45885a")
}

export const IssuesStoreModule: Module<IssuesState, RootState>  = {
    namespaced: true,
    state: {
        issues: []
    },
    getters: {
        getIssue: (state) => (article: Article) => {
            return state.issues.find((issue: Collection) => {
                return issue.articles.some((art: Article) => {
                    return art.uuid == article.uuid;
                });
            });
        },
        getArticle: (state) => (nodeNum: number) => {
            console.log(state.issues.length);
            let issues = [...state.issues];
            let issueCount = state.issues.length;
            for (let i = 0; i < issueCount; i++) {
                for (let j = 0; j < issues[i].articles.length; j++) {
                    if (issues[i].articles[j].nodeNumber === nodeNum) {
                        return [issues[i].articles[j], issues[i], j];
                    }
                }
            }
            return [];
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
        }
    },
    actions: {
        addIssue(context, issue: Collection) {
            context.commit('addIssue', issue);
        }
    }
};