import { GetterTree } from 'vuex';
import { MenuTreeState } from '@/types/storeTypes';
import {MainMenuItem} from '@/classes/MainMenuItem';
import {RootState} from '@/store';

export const getters: GetterTree<MenuTreeState, RootState> = {
    menuTree(state: MenuTreeState): MainMenuItem[] {
        return state.main;
    },
};
