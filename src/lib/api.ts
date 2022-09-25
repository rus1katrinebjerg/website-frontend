async function fetchAPI<T>(
  query: string,
  { variables }: { variables?: any } = {}
): Promise<T> {
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  const res = await fetch(import.meta.env.WP_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}

export async function getAllTopLevelPages() {
  interface Data {
    pages: {
      edges: {
        node: {
          slug: string;
        };
      }[];
    };
  }
  const data = await fetchAPI<Data>(`
    {
      pages(first: 10000, where: {parent: 0}) {
        edges {
          node {
            slug
          }
        }
      }
    }
    `);

  return data?.pages;
}

export async function getAllMenuItems() {
  interface Data {
    menu: {
      menuItems: {
        nodes: {
          uri: string;
          label: string;
        }[];
      };
    };
  }
  const data = await fetchAPI<Data>(`
    {
        menu(id: "main", idType: NAME) {
            menuItems {
              nodes {
                uri
                label
              }
            }
        }
    }
    `);

  return data?.menu.menuItems.nodes;
}

export async function getPageByUri(uri: string) {
  console.log(`uri = "${uri}"`);
  interface Data {
    page: {
      title: string;
      content: string;
    };
  }
  const data = await fetchAPI<Data>(`
    {
      page(id: "${uri}", idType: URI) {
        title
        content
      }
    }
    `);

  return data?.page;
}
