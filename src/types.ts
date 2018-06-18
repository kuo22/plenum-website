// TODO: seperate types into smaller files

export interface RootState {
    version: string;
}

// Profile types

// TODO replace User with Menu?
// TODO implement current "interfaces" (class objects) as true interfaces like this
export interface User {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}

// Interface for an element of the main navigation
export interface Menu {
    title: string; // link.title
    description?: string; // link.description
    weight: number; // link.weight
    parentMenu: string; // link.menu_name
    url?: string; // link.url
    has_children: boolean; // has_children
    subtree?: Menu[]; // subtree
}

// States

export interface MenuTreeState {
    main: Menu[];
    error: boolean;
}

export interface MenuState {
    active: boolean;
    open: boolean;
    error: boolean;
}

export interface ProfileState {
    user?: User;
    error: boolean;
}

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
