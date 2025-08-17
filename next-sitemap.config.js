/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://honeycup.ru',        // твой прод-домен
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/api/*', '/admin*'],        // добавь приватные пути
  robotsTxtOptions: {
    additionalSitemaps: ['https://honeycup.ru/server-sitemap.xml'],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/admin'] },
    ],
  },
};