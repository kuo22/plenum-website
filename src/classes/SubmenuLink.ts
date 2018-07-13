import {Article, Collection} from '@/types/types';

export class SubmenuLink implements Collection {
    public title: string;
    public coverImageURL: string;
    public articles: { [nodeID: number]: Article };

    public nodeNumber: number;
    public uuid: string;

    public href?: string;

    constructor(title: string,
                coverImageURL: string,
                articles: { [nodeID: number]: Article },
                nodeNumber: number,
                uuid: string,
                href?: string) {
        this.title = title;
        if (href) {
            this.href = href;
        }
        this.coverImageURL = coverImageURL;
        this.articles = articles;

        this.nodeNumber = nodeNumber;
        this.uuid = uuid;
    }
}
