export type ListItem = {
  title: string;
  poster_path: string;
  filmID: number;
  createdAt?: Date;
};

export type ListType = "toWatch" | "watched" | "favorites";
