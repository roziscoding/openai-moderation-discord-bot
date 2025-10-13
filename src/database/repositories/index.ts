import db from '..'
import { OrganizationRepository } from './organization.repository'
import { StrikesRepository } from './strikes.repository'

export const repositories = {
  organization: new OrganizationRepository(db),
  strikes: new StrikesRepository(db),
}
