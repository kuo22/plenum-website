import { GetterTree } from 'vuex';
import { MenuTreeState } from '@/types/storeTypes';
import { RootState } from '@/types/storeTypes';
import {MainMenuItem} from '@/classes/MainMenuItem';

export const getters: GetterTree<MenuTreeState, RootState> = {
    menuTree(state: MenuTreeState): MainMenuItem[] {
        return state.main;
    },
};
