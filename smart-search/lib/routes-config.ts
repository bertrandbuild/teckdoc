export type EachRoute = {
  title: string
  href: string
  noLink?: true
  items?: EachRoute[]
}

export const ROUTES: EachRoute[] = [
  {
    title: "Welcome",
    href: "/welcome",
    noLink: true,
    items: [
      { title: "Welcome to Nillion's Docs", href: "/welcome-nillion" },
      {
        title: "Quick Start Guide",
        href: "/quick-start-guide",
        items: [
          { title: "Install Nillion", href: "/quickstart-install" },
          { title: "Deploy to the Testnet", href: "/quickstart-testnet" },
        ],
      },
    ],
  },
  {
    title: "Learn",
    href: "/learn",
    noLink: true,
    items: [
      { title: "High Value Data", href: "/high-value-data" },
      {
        title: "Multi Party Computation",
        href: "/multi-party-computation",
      },
      { title: "Network", href: "/network" },
      { title: "Nillions MPC Protocol", href: "/nillions-mpc-protocol" },
      { title: "What is Nillion", href: "/what-is-nillion" },
    ],
  },
  {
    title: "Building",
    href: "/building",
    noLink: true,
    items: [
      { title: "Limitations", href: "/limitations" },
      { title: "Nada Lang", href: "/nada-lang" },
      { title: "Network Configuration", href: "/network-configuration" },
      { title: "Nillion Client", href: "/nillion-client" },
      { title: "Nillion SDK and Tools", href: "/nillion-sdk-and-tools" },
      { title: "Start Building", href: "/start-building" },
    ],
  },
  {
    title: "Resources",
    href: "/resources",
    noLink: true,
    items: [
      {
        title: "Community and Support",
        href: "/community-and-support",
      },
      { title: "Data Wars", href: "/data-wars" },
      { title: "Glossary", href: "/glossary" },
      {
        title: "Nucleus Builders Program",
        href: "/nucleus-builders-program",
      },
      {
        title: "Technical Reports and Demos",
        href: "/technical-reports-and-demos",
      },
      { title: "Testnet Guides", href: "/testnet-guides" },
    ],
  },
]

function getRecurrsiveAllLinks(node: EachRoute): {
  title: string
  href: string
}[] {
  const allPages: {
    title: string
    href: string
  }[] = []

  if (!node.noLink) {
    allPages.push({
      title: node.title,
      href: node.href,
    })
  }

  // Recursively process the child items, if any, and append their results.
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` }
    allPages.push(...getRecurrsiveAllLinks(temp))
  })

  return allPages
}

// Generate a flat list of all pages by mapping over the ROUTES array.
export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat()
