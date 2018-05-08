export default class Project {
    public title: string;
    public nickname: string;
    public year: number;
    public categories: string[];
    public collaborators?: string[];
    public url: string;

    constructor(title: string, nickname: string, year: number, categories: string[], collaborators?: string[]) {
        this.title = title;
        this.nickname = nickname;
        this.year = year;
        this.collaborators = collaborators;
        this.url = title.replace(/\s/g, '');
        this.categories = categories;
    }
}
