import { GetterTree } from 'vuex';
import {Menu, MenuTreeState} from '@/types';
import { RootState } from '@/types';
import {state} from '@/store/modules/menuTree/menuTree';

export const getters: GetterTree<MenuTreeState, RootState> = {
    mainMenu(state: MenuTreeState): Menu[] {
        return state.main;
    },
};
