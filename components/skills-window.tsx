import Window from "@/components/window"

const skills = [
  { name: "HTML", level: 5 },
  { name: "CSS", level: 4 },
  { name: "JavaScript", level: 5 },
  { name: "React", level: 4 },
  { name: "Next.js", level: 3 },
  { name: "Node.js", level: 3 },
]

export default function SkillsWindow() {
  return (
    <Window title="Magical_Skills" width="w-64" height="h-auto" x="right-4" y="top-4">
      <div className="grid grid-cols-4 gap-2 border border-white p-2 mb-2">
        {[16, 8, 4, 2, 32, 64, 128, 1, 512, 256, 1024, 2048].map((num, i) => (
          <div key={i} className="border border-white h-8 flex items-center justify-center">
            <span className="text-white text-xs">{num}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-white text-xs">{skill.name}</div>
            <div className="flex-1 h-4 border border-white flex items-center px-1">
              <div className="relative w-full h-2">
                <div className="absolute inset-0 bg-pattern-dots"></div>
                <div
                  className="absolute top-0 bottom-0 left-0 bg-white"
                  style={{ width: `${skill.level * 20}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Window>
  )
}

