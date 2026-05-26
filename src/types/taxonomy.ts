export interface SkillItemResponse {
  skillId: string
  name: string
}

export interface SkillsResponse {
  skills: SkillItemResponse[]
}

export interface RoleItemResponse {
  roleId: string
  name: string
}

export interface RolesResponse {
  roles: RoleItemResponse[]
}
