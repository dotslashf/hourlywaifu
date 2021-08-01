interface PageInterface {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface CharactersInterface {
  data: {
    Page: {
      pageInfo: PageInterface;
      characters: [CharacterStructure];
    };
  };
}

interface baseStructure {
  id: number;
  siteUrl: string;
  favourites: number;
}

export interface CharacterStructure extends baseStructure {
  name: {
    first: string;
    middle: string;
    last: string;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: {
    large: string;
    medium: string;
  };
  gender: 'Male' | 'Female' | null;
}
