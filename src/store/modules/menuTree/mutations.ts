import { MutationTree } from 'vuex';
import {MenuTreeState} from '@/store/modules/menuTree/menuTreeModule';

export const mutations: MutationTree<MenuTreeState> = {
    apiDataPending(state, hardCodedMenu: Array<Object>) {
        state.main = hardCodedMenu;
    },
    apiDataSuccess(state, collectionsData: Object) {
        state.loading = false;
        state.main = state.main.map(menuItem => {
            if (menuItem.title === 'Publications') {
                menuItem.submenu = collectionsData;
            }
            return menuItem;
        })
    },
    apiDataFailure(state, error) {
        state.loading = false;
        state.error = true;
    },
    updateMenuTree(state, menuTree: Array<Object>) {
        state.main = menuTree;
    },
    deactivateMainMenuItems(state) {
        state.main = state.main.map((menuItem: any) => {
            menuItem.expanded = false;
            return menuItem;
        });
    },
    deactivateAllPreviews(state) {
        state.main = state.main.map(deactivateSubmenus);
    },
    activateMainMenuItem(state, clickedMenuItem) {
        state.main = state.main.map((menuItem: any) => {
            if (menuItem.title === clickedMenuItem.title) {
                menuItem.expanded = true;
            }
            return menuItem;
        })
    }
};

// Deactivates provided submenu item
// parameter:
//      submenuItem = fly out submenu item
let deactivateAll = (submenuItem) => {
    submenuItem.expanded = false;
    return submenuItem;
};

// Deactivates all submenu items of the provided main menu item parent
let deactivateSubmenus = (mainMenuItem) => {
    if (mainMenuItem.expanded && mainMenuItem.hasSections) { // Expanded with sections
        mainMenuItem.submenu = mainMenuItem.submenu.map(section => {
            section.submenu = section.submenu.map(deactivateAll); //this.submenuFn
            return section;
        });
    } else if (mainMenuItem.expanded) { // Expanded with links // TODO: deprecate, straight links should not preview
        mainMenuItem.submenu = mainMenuItem.submenu.map(deactivateAll) //this.submenuFn
    }
    return mainMenuItem;
};
