export default defineAppConfig({
  title: 'ZQ-URL',
  description: '短链与数据分析',
  email: 'zq@qizou.dpdns.org',
  github: 'https://github.com/BAYUEQI/ZQ-URL',
  githubProfile: 'https://github.com/BAYUEQI',
  telegram: 'https://t.me/bayueqi',
  blog: 'https://blog.520jacky.dpdns.org',
  previewTTL: 300, // 5 minutes
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: [
    'dashboard',
  ],
})
