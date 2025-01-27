import { graph, config,auth } from '@grafbase/sdk'

const g = graph.Standalone()

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedinUrl: g.url().optional(), 
  // @ts-ignore
  projects: g.relation(() => Project).list().optional(),
  // @ts-ignore
}).auth((rules) => {
  rules.public().read()
})

// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(), 
  image: g.url(),
  liveSiteUrl: g.url(), 
  githubUrl: g.url(), // @ts-ignore
  category: g.string().search(),// @ts-ignore
  createdBy: g.relation(() => User),// @ts-ignore
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret:  g.env('NEXTAUTH_SECRET')
})
// @ts-ignore
export default({
  schema: g,
  auth: {
    providers: [jwt],// @ts-ignore
    rules: (rules) => rules.private()
  },
})
