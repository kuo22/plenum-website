import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { MenuState } from '@/types';
import { RootState } from '@/types';

export const state: MenuState = {
    active: false,
    open: false,
    error: false,
};

const namespaced: boolean = true;

export const index: Module<MenuState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};
