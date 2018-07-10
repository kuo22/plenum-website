
import {MainMenuItem} from '@/classes/MainMenuItem';

// States

export interface RootState {
    version: string;
}

export interface MenuTreeState {
    main: MainMenuItem[];
    error: boolean;
}

export interface MenuState {
    active: boolean;
    open: boolean;
    error: boolean;
}
