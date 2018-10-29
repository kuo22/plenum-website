import { GetterTree } from 'vuex';
import { MenuTreeState } from '@/types/storeTypes';
import {RootState} from '@/store';

export const getters: GetterTree<MenuTreeState, RootState> = {
    menuTree(state): Array<Object> {
        return state.main;
    },
    anyMenuIsOpen(state): boolean {
        return state.main.some((menuItem: any) => menuItem.expanded);
    }
};
