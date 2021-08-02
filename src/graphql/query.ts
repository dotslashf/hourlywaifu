export const GET_RANDOM_CHARACTER = `
query($page: Int) {
  Page(page: $page) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    characters(sort: FAVOURITES_DESC) {
      id
      name {
        first
        middle
        last
        full
        native
        userPreferred
      }
      image {
        large
        medium
      }
      siteUrl
      gender
      favourites
    }
  }
}`;

export const GET_CHARACTER_ANIME = `
query ($id: Int) {
  Character(id: $id) {
    media {
      nodes {
        id
        favourites
        title {
          userPreferred
        }
        coverImage {
          extraLarge
        }
        type
      }
    }
  }
}`;
