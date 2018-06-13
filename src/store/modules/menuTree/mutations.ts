import { MutationTree } from 'vuex';
import { MenuHierarchyState, User } from './types';

export const mutations: MutationTree<MenuHierarchyState> = {
    menusLoaded(state, payload: User) {
        state.error = false;
        state.user = payload;
    },
    menusError(state) {
        state.error = true;
        state.user = undefined;
    },
};
