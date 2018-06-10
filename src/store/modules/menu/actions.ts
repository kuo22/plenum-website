import { ActionTree } from 'vuex';
import axios from 'axios';
import { MenuState, User } from '@/types';
import { RootState } from '@/types';


export const actions: ActionTree<MenuState, RootState> = {
    fetchData({ commit }): any {
        axios({
            url: 'https://....',
        }).then((response) => {
            const payload: User = response && response.data;
            commit('profileLoaded', payload);
        }, (error) => {
            // console.log(error);
            commit('profileError');
        });
    },
};
