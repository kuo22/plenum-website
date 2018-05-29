// An entry of the main menu
export class ArticlePeerReviewed {

    public title: string;        // Name of the menu item
    public subtitle?: string;
    public author: string;
    public university?: string;
    public school?: string;
    public abstract: string;
    public body: string;
    // public sectionTitles: string[];
    // public sections: string[];

    constructor(title: string,
                author: string,
                abstract: string,
                body: string,
                university?: string,
                school?: string,
                subtitle?: string) {

        this.title = title;
        this.author = author;
        this.abstract = abstract;
        this.body = body;
        this.subtitle = subtitle;
    }
}
