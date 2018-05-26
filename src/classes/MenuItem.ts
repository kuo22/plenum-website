export class MenuItem {
    // An entry of the main menu

    private name: string;
    private color: string;
    private active: boolean;
    private subMenu?: { [header: string]: string[]};

    constructor(name: string, color: string, subMenu?: { [header: string]: string[]}) {
        this.name = name;
        this.color = color;
        this.active = false;
        this.subMenu = subMenu;
    }
}
