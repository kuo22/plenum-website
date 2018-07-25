import { MutationTree } from 'vuex';
import {MenuTreeState} from '@/types/storeTypes';
import {MainMenuItem} from '@/classes/MainMenuItem';

export const mutations: MutationTree<MenuTreeState> = {
    menusLoaded(state, payload: MainMenuItem[]) {
        state.main = payload;
        state.error = false;
    },
};
