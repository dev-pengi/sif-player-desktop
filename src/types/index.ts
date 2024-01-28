type Dir = {
    name: string;
    path: string;
    dir: boolean;
    creationDate: number;
    parent: string;
    videos?: string[];
    nestedDirs?: string[];
    searchValid?: boolean;
}

type SortType = "newest" | "oldest" | "name" | "size";

export type { Dir, SortType }