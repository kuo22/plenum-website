// An entry of the main menu
export class ArticlePeerReviewed {

    public title: string;        // Name of the menu item
    public subtitle?: string;
    public author: string;
    public university?: string;
    public school?: string;
    public abstract: string;
    public body: string;
    public refs: string;
    public downloadURL: string;
    public copyright: boolean;
    // public sectionTitles: string[];
    // public sections: string[];

    constructor(title: string,
                author: string,
                abstract: string,
                body: string,
                refs: string,
                downloadURL: string,
                copyright: boolean,
                university?: string,
                school?: string,
                subtitle?: string) {

        this.title = title;
        this.author = author;
        this.abstract = abstract;
        this.body = body;
        this.refs = refs;
        this.downloadURL = downloadURL;
        this.copyright = copyright;
        this.university = university;
        this.school = school;
        this.subtitle = subtitle;

    }
}
