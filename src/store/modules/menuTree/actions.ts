import { ActionTree } from 'vuex';
import fetcher from '@/fetcher';
import {DrupalMenu} from '@/types/types';
import {MenuTreeState, RootState} from '@/types/storeTypes';
import {error} from 'util';
import {MainMenuItem} from '@/classes/MainMenuItem';

// TODO: can a plain function be here? should this be private
function parseMenuData(menuTree: any): DrupalMenu[] {
    const menus: DrupalMenu[] = [];
    if (menuTree.length > 0) {
        for (const menuNode of menuTree) {
            const newMenu: DrupalMenu = {
                title: menuNode.link.title,
                description: menuNode.link.description,
                weight: menuNode.link.weight,
                depth: menuNode.depth,
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
    fetchMenuData({ commit }): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            fetchMenuTree()
                .then((menuTree: DrupalMenu[]) => {
                    commit('menusLoaded', menuTree);
                    resolve();
                })
                .catch((error) => {
                    commit('menusError');
                    reject(error);
                });
        });

        async function fetchMenuTree(): Promise<any> {
            return await fetcher({
                url: 'entity/menu/main/tree',
                params: {
                    _format: 'json',
                },
                timeout: 1000,
                // socketPath: ,

            }).then((response) => {
                const menuTree: DrupalMenu[] = parseMenuData(response.data).sort(
                    (menu1, menu2) => {
                        return menu1.weight - menu2.weight;
                    },
                );
                return menuTree;
                // process Menu[] to MenuItem[]
                // createMenu(response && response.data);
                // const payload: Menu[];
            });
        }
    },
};
