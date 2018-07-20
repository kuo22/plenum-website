// Profile types
// TODO implement current "interfaces" (class objects) as true interfaces like this

// Interface for an element of the main navigation
export interface DrupalMenu {
    title: string; // link.title
    description?: string; // link.description
    weight: number; // link.weight
    depth: number; // depth
    url?: string; // link.url
    has_children: boolean; // has_children
    subtree: DrupalMenu[]; // subtree
    collection?: Collection;
    coverImageURL?: string;
}

// A Drupal content node
export interface DrupalNode {
    nodeNumber: number;
    uuid: string;
    urlPath?: string;
}

// A content author
export interface Author {
    firstName: string;
    lastName: string;
    university?: string;
    school?: string;
}

// A peer-reviewed research article
export interface Article extends DrupalNode {
    author: Author;
    title: string;
    subtitle?: string;
    abstract: string;
    body: string;
    refs: string;
    copyright: boolean;
    downloadURL: string;
}

// A Plenum Issue, a collection of articles
export interface Collection extends DrupalNode {
    articles: Article[];
    title: string;
    coverImageURL: string;
}

export class Article implements Article {
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

/*
export interface MenuLink {

}
*/

