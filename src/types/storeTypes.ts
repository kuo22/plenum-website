import {DrupalMenu} from '@/types/types';

// States

export interface RootState {
    version: string;
}

export interface MenuTreeState {
    main: DrupalMenu[];
    error: boolean;
}

export interface MenuState {
    active: boolean;
    open: boolean;
    error: boolean;
}
