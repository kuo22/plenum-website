import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import {RootState} from '@/store';

export interface MenuTreeState {
    main: Array<any>;
    loading: boolean;
    error: boolean;
}

export const MenuTreeStoreModule: Module<MenuTreeState, RootState> = {
    namespaced: true,
    state: {
        main: [],
        loading: false,
        error: false
    },
    getters,
    actions,
    mutations,
};
