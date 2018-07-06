import { GetterTree } from 'vuex';
import { MenuTreeState } from '@/types/storeTypes';
import { RootState } from '@/types/storeTypes';
import {state} from '@/store/modules/menuTree/menuTree';
import {DrupalMenu} from '@/types/types';

export const getters: GetterTree<MenuTreeState, RootState> = {
    drupalMenuTree(state: MenuTreeState): DrupalMenu[] {
        return state.main;
    },
};
