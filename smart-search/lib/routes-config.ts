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
      { title: "Welcome to our Docs", href: "/welcome" },
      {
        title: "Quick Start Guide",
        href: "/quick-start-guide",
        items: [
          { title: "Install", href: "/quickstart-install" },
        ],
      },
    ],
  },
]

export const BLOCKLESS_ROUTES: EachRoute[] = [
  {
    title: "Welcome",
    href: "/welcome",
    noLink: true,
  },
  {
    title: "Network",
    href: "/network",
    items: [
      {
        title: "Economics",
        href: "/economics",
        noLink: true,
        items: [
          { title: "Token-Economics", href: "/token-economics" },
        ],
      },
      {
        title: "Functions Workflow",
        href: "/functions-workflow",
      },
    ],
  },
  {
    title: "Protocol",
    href: "/protocol",
    items: [
      { title: "Extension", href: "/extension" },
      { title: "Core Concepts", href: "/core-concepts" },
    ],
  },
  {
    title: "Developer tools",
    href: "/developer-tools",
    items: [
      { title: "Dashboard", href: "/dashboard" },
      {
        title: "Cli",
        href: "/cli",
        noLink: true,
        items: [
          { title: "Quickstart", href: "/quick-start" },
        ],
      },
      {
        title: "Sdks",
        href: "/sdks",
        noLink: true,
        items: [
          { title: "AssemblyScript", href: "/assemblyscript" },
        ],
      },
    ],
  },
]

export const AVAIL_ROUTES: EachRoute[] = [
  {
    title: "Introduction to Avail",
    href: "/introduction-to-avail",
    noLink: true,
  },
  {
    title: "Learn about Avail",
    href: "/learn-about-avail",
    noLink: true,
    items: [
      { title: "Consensus", href: "/consensus" },
      { title: "EIP-4844", href: "/eip-4844" },
    ],
  },
  {
    title: "Build with Avail",
    href: "/build-with-avail",
    noLink: true,
    items: [
      { title: "Validium", href: "/validium" },
      { title: "Optimium", href: "/optimium" },
      { title: "Soveriegn-rollups", href: "/sovereign-rollups" },
    ],
  },
  {
    title: "Network",
    href: "/network",
    items: [
      { title: "Economics", href: "/economics" },
      { title: "Functions Workflow", href: "/functions-workflow" },
      { title: "Tutorials", href: "/tutorials" },
    ],
  },
  {
    title: "Operate a node",
    href: "/operate-a-node",
  },
  {
    title: "The Avail Trinity",
    href: "/the-avail-trinity",
  },
  {
    title: "Clash of nodes",
    href: "/clash-of-nodes",
  },
  {
    title: "Glossary",
    href: "/glossary",
  },
]

export const NILLION_ROUTES: EachRoute[] = [
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
      // { title: "Network", href: "/network" },
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

// Updated function to determine which routes to use based on selectedDemo
export function getActiveRoutes(): EachRoute[] {
  const selectedDemo = typeof window !== 'undefined' ? localStorage.getItem('selectedDemo') : null;
  console.log(selectedDemo)
  
  if (selectedDemo === 'docs') {
    return ROUTES;
  } else if (selectedDemo === 'nillion') {
    return NILLION_ROUTES;
  } else if (selectedDemo === 'blockless') {
    return BLOCKLESS_ROUTES;
  }
  
  // Default to NILLION_ROUTES if selectedDemo doesn't match
  return NILLION_ROUTES;
}

// Update page_routes to use the dynamic routes
export const page_routes = getActiveRoutes().map((it) => getRecurrsiveAllLinks(it)).flat()
