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
    uuid: string; // "081b98ba-4ec8-429d-9152-2c231f45885a"
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
    previewVisible?: boolean;
}

// A Plenum Issue, a collection of articles
export interface Collection extends DrupalNode {
    articles: Article[];
    title: string;
    coverImageURL: string;
    datePublished: string;
}

/*
export interface MenuLink {

}
*/

