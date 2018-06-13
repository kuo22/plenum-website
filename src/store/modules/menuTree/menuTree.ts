import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import {Menu, MenuTreeState} from '@/types';
import { RootState } from '@/types';

export const state: MenuTreeState = {
    main: [],
};

const namespaced: boolean = true;

export const menuTree: Module<MenuTreeState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
