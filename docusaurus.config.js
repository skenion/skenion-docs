const { manualDocusaurusVersions } = require("./src/manual-versioning.cjs");

const config = {
  title: "Skenion Manual",
  tagline: "Authoring, graph model, and runtime behavior for Skenion.",

  url: "https://echovisionlab.github.io",
  baseUrl: process.env.SKENION_MANUAL_BASE_URL ?? "/skenion-docs/",

  organizationName: "echovisionlab",
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
            `https://github.com/echovisionlab/skenion-docs/tree/main/${versionDocsDirPath}/${docPath}`
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
      title: "Skenion Manual",
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
          href: "https://github.com/echovisionlab/skenion-docs",
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
          items: [
            {
              label: "Latest",
              to: "/manual/"
            },
            {
              label: "0.43",
              to: "/manual/0.43"
            },
            {
              label: "0.33",
              to: "/manual/0.33"
            }
          ]
        },
        {
          title: "Project",
          items: [
            {
              label: "Skenion Docs",
              href: "https://github.com/echovisionlab/skenion-docs"
            },
            {
              label: "Skenion Examples",
              href: "https://github.com/echovisionlab/skenion-examples"
            }
          ]
        }
      ],
      copyright: `Copyright ${new Date().getFullYear()} EchoVisionLab.`
    },
    prism: {
      additionalLanguages: ["json", "toml", "rust"]
    }
  }
};

module.exports = config;
