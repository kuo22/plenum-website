import { GetterTree } from 'vuex';
import { MenuTreeState } from '@/types';
import { RootState } from '@/types';

export const getters: GetterTree<MenuTreeState, RootState> = {
    issuesExist(state): boolean {
        return true;
        // const { user } = state;
        // const firstName = (user && user.firstName) || '';
        // const lastName = (user && user.lastName) || '';
        // return `${firstName} ${lastName}`;
    },
};
