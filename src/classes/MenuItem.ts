export class MenuItem {
    // An entry of the main menu

    public name: string;
    public color: string;
    public active: boolean;
    public subMenu?: { [header: string]: string[]};

    constructor(name: string, color: string, subMenu?: { [header: string]: string[]}) {
        this.name = name;
        this.color = color;
        this.active = false;
        this.subMenu = subMenu;
    }
}
