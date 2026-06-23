const {
  manualDocusaurusVersions,
  manualVersions
} = require("./src/manual-versioning.cjs");

const manualFooterItems = Object.freeze([
  {
    label: "Latest",
    to: "/manual/"
  },
  ...manualVersions.map((version) => ({
    label: version,
    to: `/manual/${version}`
  }))
]);

const config = {
  title: "skenion Manual",
  tagline: "Authoring, graph model, and runtime behavior for skenion.",

  url: "https://skenion.github.io",
  baseUrl: process.env.SKENION_MANUAL_BASE_URL ?? "/skenion-docs/",

  organizationName: "skenion",
  projectName: "skenion-docs",
  trailingSlash: true,

  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw"
    }
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"]
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "manual",
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "current",
          versions: manualDocusaurusVersions,
          editUrl: ({ versionDocsDirPath, docPath }) => (
            `https://github.com/skenion/skenion-docs/tree/main/${versionDocsDirPath}/${docPath}`
          )
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],

  themeConfig: {
    navbar: {
      title: "skenion Manual",
      logo: {
        alt: "skenion",
        src: "img/skenion-logo-safe.svg"
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "manualSidebar",
          position: "left",
          label: "Manual"
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true
        },
        {
          href: "https://github.com/skenion/skenion-docs",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Manual",
          items: manualFooterItems
        },
        {
          title: "Project",
          items: [
            {
              label: "skenion Docs",
              href: "https://github.com/skenion/skenion-docs"
            },
            {
              label: "skenion Examples",
              href: "https://github.com/skenion/skenion-examples"
            }
          ]
        }
      ],
      copyright: `Copyright ${new Date().getFullYear()} skenion contributors.`
    },
    prism: {
      additionalLanguages: ["json", "toml", "rust"]
    }
  }
};

module.exports = config;
