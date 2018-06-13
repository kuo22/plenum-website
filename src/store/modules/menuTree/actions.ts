import { ActionTree } from 'vuex';
import fetcher from '@/fetcher';
import {Menu, MenuTreeState, User} from '@/types';
import { RootState } from '@/types';

private function parseMenuData(menuTree): Menu[] {
    let menus: Menu[];
    if (menuTree.length > 0) {
        menus = [];

        for (const menuNode of menuTree) {
            const newMenu: Menu = {
                title: menuNode.link.title,
                description: menuNode.link.description,
                weight: menuNode.link.weight,
                parentMenu: menuNode.link.menu_name,
                url: menuNode.link.url,
                has_children: menuNode.has_children,
                subtree: parseMenuData(menuNode.subtree),
            };
            menus.push(newMenu);
        }
    }

    return menus;
}


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
            // console.log('processing response...');
            const payload: Menu[] = parseMenuData(response.data).sort(
                (menu1, menu2) => {
                    return menu1.weight - menu2.weight;
                },
            );
            // createMenu(response && response.data);
            // const payload: Menu[];
            commit('menusLoaded', payload);
        }, (error) => {
            // console.log(error);
            commit('menusError');
        });
    },
};
