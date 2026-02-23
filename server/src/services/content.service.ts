import type {
  Profile,
  ProjectsData,
  SkillsData,
  SpellsData,
  ToolsData,
  TrashData,
  SkillTreeData,
  QuestLogData,
  LaboratoryData
} from '../../../shared/types/index.js'

// Static JSON imports — bundler always includes these, works reliably on Vercel
import profileData from '../../../content/profile.json'
import projectsData from '../../../content/projects.json'
import skillsData from '../../../content/skills.json'
import spellsData from '../../../content/spells.json'
import toolsData from '../../../content/tools.json'
import trashData from '../../../content/trash.json'
import skillTreeData from '../../../content/skill-tree.json'
import questLogData from '../../../content/quest-log.json'
import laboratoryData from '../../../content/laboratory.json'

export const getProfile = () => profileData as Profile
export const getProjects = () => projectsData as ProjectsData
export const getSkills = () => skillsData as SkillsData
export const getSpells = () => spellsData as SpellsData
export const getTools = () => toolsData as ToolsData
export const getTrash = () => trashData as TrashData
export const getSkillTree = () => skillTreeData as SkillTreeData
export const getQuestLog = () => questLogData as QuestLogData
export const getLaboratory = () => laboratoryData as LaboratoryData
