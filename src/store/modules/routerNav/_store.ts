import {Module} from "vuex";
import {RootState} from "@/store";

interface RouterNavState {
    pageVisitCount: number;
}

export const RouterNavStoreModule: Module<RouterNavState, RootState>  = {
    namespaced: true,
    state: {
        pageVisitCount: 0
    },
    getters: {
        getVisitCount: (state)  => {
            return state.pageVisitCount;
        }
    },
    mutations: {
        decrementVisitCount(state) {
            state.pageVisitCount--;
        },
        incrementVisitCount(state) {
            state.pageVisitCount++;
        },
        resetVisitCount(state) {
            state.pageVisitCount = 0;
        }
    },
    actions: {
        pageVisited({ commit }) {
            commit('incrementVisitCount');
        },
        resetVisitCount({ commit, state }) {
            if (state.pageVisitCount !== 0) {
                commit('resetVisitCount');
            }
        }
    }
};