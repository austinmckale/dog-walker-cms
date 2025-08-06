import { walkPlan } from './walkPlan'
import { dog } from './dog' // 👈 add this line
import { client } from './client' 

export const schemaTypes = [walkPlan, dog, client]
