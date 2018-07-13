import {Article, Collection} from '@/types/types';

export class SubmenuLink implements Collection {
    public title: string;
    public href: string;
    public coverImageURL: string;
    public articles: Article[];
    public articleIds: string[];

    public nodeNumber: number;
    public uuid: string;


    constructor(text: string,
                href: string,
                coverImageURL: string,
                articles: Article[],
                articleIds: string[],
                nodeNumber: number,
                uuid: string) {
        this.title = text;
        this.href = href;
        this.coverImageURL = coverImageURL;
        this.articles = articles;
        this.articleIds = articleIds;

        this.nodeNumber = nodeNumber;
        this.uuid = uuid;
    }
}
