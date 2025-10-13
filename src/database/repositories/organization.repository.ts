import type { Database } from '..'
import { eq } from 'drizzle-orm'
import { organization } from '../schema'

export class OrganizationRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string) {
    return await this.db.query.organization.findFirst({
      where: eq(organization.slug, id),
    })
  }

  async setConfig(id: string, config: Record<string, unknown>) {
    await this.db.update(organization).set({ metadata: JSON.stringify({ config }) }).where(eq(organization.slug, id))
  }

  async findBySlug(slug: string) {
    return await this.db.query.organization.findFirst({
      where: eq(organization.slug, slug),
    })
  }
}
