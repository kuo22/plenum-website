import { MutationTree } from 'vuex';
import { MenuTreeState, User } from './types';
import {Menu} from '@/types';

export const mutations: MutationTree<MenuTreeState> = {
    menusLoaded(state, payload: Menu[]) {
        state.main = payload;
    },
    menusError(state) {
        state.error = true;
    },
};
