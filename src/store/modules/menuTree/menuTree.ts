import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import {DrupalMenu} from '@/types/types';
import {MenuTreeState, RootState} from '@/types/storeTypes';

export const state: MenuTreeState = {
    main: [],
    error: false,
};

const namespaced: boolean = true;

export const menuTree: Module<MenuTreeState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
