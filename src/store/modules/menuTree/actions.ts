import { ActionTree } from 'vuex';
import fetcher from '@/fetcher';
import {Menu, MenuTreeState, User} from '@/types';
import { RootState } from '@/types';
import {error} from 'util';
import {MenuItem} from '@/classes/MenuItem';

function parseMenuData(menuTree: any): Menu[] {
    const menus: Menu[] = [];
    if (menuTree.length > 0) {
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
    fetchData({ commit }): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            fetchMenuTree()
                .then((menuTree: Menu[]) => {
                    commit('menusLoaded', menuTree);
                    resolve(menuTree);
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
                const menuTree: Menu[] = parseMenuData(response.data).sort(
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
