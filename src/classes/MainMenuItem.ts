// An entry of the main menu
export class MainMenuItem {

    public name: string;        // Name of the menu item
    public color: string;       // Color associated with menu item (for background, submenu, etc.)
    public open: boolean;       // Menu's open state--if the submenu for the menu entry is 'open'
    public active: boolean;     // Menu's active state--if content from the menu/submenu is rendered/active
    public hoverState: boolean; // If the menu item is being hovered by cursor
    public subMenu?: { [header: string]: string[] }; // The submenu content associated with the main menu entry
    public url?: string;
    // { [header: string]: string[] }
    // public submenus: { [header: string]: string[]};

    constructor(name: string, color: string, subMenu?: { [header: string]: string[] }, url?: string) {
        this.name = name;
        this.color = color;
        this.open = false;
        this.active = false;
        this.hoverState = false;
        this.subMenu = subMenu;
        this.url = url;
    }
}

interface MenuItem {
    name: string;
}


