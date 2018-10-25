import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
// import {MainMenuItem} from '@/classes/MainMenuItem';
import {RootState} from '@/store';

export interface MenuTreeState {
    main: Array<Object>;
}

export const MenuTreeStoreModule: Module<MenuTreeState, RootState> = {
    namespaced: true,
    state: {
        main: [],
    },
    getters,
    actions,
    mutations,
};
