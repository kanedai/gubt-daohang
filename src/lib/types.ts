export interface NavLink {
    id: string;
    title: string;
    url: string;
    description?: string;
    icon?: string;
}

export interface Category {
    id: string;
    title: string;
    links: NavLink[];
}
