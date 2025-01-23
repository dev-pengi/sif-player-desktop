export type Dir = {
  name: string;
  path: string;
  dir: boolean;
  creationDate: number;
  parent: string;
  videos?: string[];
  nestedDirs?: string[];
  searchValid?: boolean;
};

export type Subtitle = {
    codec: string;
  language: string;
  file: string;
};

export type SubtitleImage = {
  start: number;
  end: number;
  image: string;
  width: number;
  height: number;
  videoWidth: number;
  videoHeight: number;
};

export type SortType = "newest" | "oldest" | "name" | "size";

