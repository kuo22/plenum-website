import { MutationTree } from 'vuex';
import { User } from '@/types/types';
import {DrupalMenu} from '@/types/types';
import {MenuTreeState} from '@/types/storeTypes';

export const mutations: MutationTree<MenuTreeState> = {
    menusLoaded(state, payload: DrupalMenu[]) {
        state.main = payload;
        state.error = false;
    },
    menusError(state) {
        state.error = true;
    },
};
