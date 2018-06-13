import { ActionTree } from 'vuex';
import fetcher from '@/fetcher';
import { MenuTreeState, User } from '@/types';
import { RootState } from '@/types';


export const actions: ActionTree<MenuTreeState, RootState> = {
    fetchData({ commit }): any {
        fetcher({
            url: 'entity/menu/main/tree',
            params: {
                _format: 'json',
            },
            timeout: 1000,
            onDownloadProgress: () => {
                // run logo loop()
            },
            // socketPath: ,

        }).then((response) => {
            const payload: User = response && response.data;
            commit('menusLoaded', payload);
        }, (error) => {
            // console.log(error);
            commit('menusError');
        });
    },
};
