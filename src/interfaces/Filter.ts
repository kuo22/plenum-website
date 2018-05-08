export default class Filter {
    public title: string;
    public checked: boolean;
    public path: string;

    constructor(title: string) {
        this.title = title;
        this.checked = false;
        this.path = this.title;
    }
}
