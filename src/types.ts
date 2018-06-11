export interface DrupalEntity {
    uuid: string;
}

export interface Author {
    firstName: string;
    lastName: string;
    university?: string;
    school?: string;
}

export interface Article extends DrupalEntity {
    author: Author;
    title: string;
    subtitle?: string;
    abstract: string;
    body: string;
    refs: string;
    downloadURL: string;
    copyright: boolean;
}

export interface Issue extends DrupalEntity {
    title: string;
    articleIds: string[];
}
