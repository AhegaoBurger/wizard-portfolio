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

// Static JSON imports — Node.js ESM requires import attributes for JSON
import profileData from '../../../content/profile.json' with { type: 'json' }
import projectsData from '../../../content/projects.json' with { type: 'json' }
import skillsData from '../../../content/skills.json' with { type: 'json' }
import spellsData from '../../../content/spells.json' with { type: 'json' }
import toolsData from '../../../content/tools.json' with { type: 'json' }
import trashData from '../../../content/trash.json' with { type: 'json' }
import skillTreeData from '../../../content/skill-tree.json' with { type: 'json' }
import questLogData from '../../../content/quest-log.json' with { type: 'json' }
import laboratoryData from '../../../content/laboratory.json' with { type: 'json' }

export const getProfile = () => profileData as Profile
export const getProjects = () => projectsData as ProjectsData
export const getSkills = () => skillsData as SkillsData
export const getSpells = () => spellsData as SpellsData
export const getTools = () => toolsData as ToolsData
export const getTrash = () => trashData as TrashData
export const getSkillTree = () => skillTreeData as SkillTreeData
export const getQuestLog = () => questLogData as QuestLogData
export const getLaboratory = () => laboratoryData as LaboratoryData
