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

export interface MenuState {
    active: boolean;
    open: boolean;
    error: boolean;
}

export interface ProfileState {
    user?: User;
    error: boolean;
}
