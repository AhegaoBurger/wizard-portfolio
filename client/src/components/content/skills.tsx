type Skill = {
  name: string
  level: number
  available: boolean
}

const skills: Skill[] = [
  { name: "HTML/CSS", level: 5, available: true },
  { name: "JavaScript", level: 4, available: true },
  { name: "React", level: 5, available: true },
  { name: "Next.js", level: 4, available: true },
  { name: "TypeScript", level: 3, available: true },
  { name: "Node.js", level: 3, available: true },
  { name: "GraphQL", level: 2, available: false },
  { name: "Python", level: 3, available: true },
]

export default function Skills() {
  return (
    <section id="artifacts" className="py-16 px-4 bg-black border-t-2 border-white border-pixel">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 pixel-text text-center">MAGICAL ABILITIES</h2>

        <div className="max-w-2xl mx-auto">
          <div className="pixel-panel border-2 border-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <SkillMeter key={index} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillMeter({ skill }: { skill: Skill }) {
  const maxStars = 5

  return (
    <div className="skill-meter">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-bold">{skill.name}</div>
        <div className={`toggle-switch ${skill.available ? "on" : "off"}`}>
          <span className="text-xs">{skill.available ? "ON" : "OFF"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }).map((_, i) => (
          <div key={i} className={`star-icon w-4 h-4 ${i < skill.level ? "active" : "inactive"}`}>
            ★
          </div>
        ))}
      </div>
    </div>
  )
}

