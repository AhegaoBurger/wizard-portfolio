import Window from "@/components/layout/window";

export default function WizardProfile() {
  return (
    <Window
      title="Wizard_Profile"
      width="w-64"
      height="h-80"
      x="left-4"
      y="top-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-full h-32 bg-pattern-diagonal mb-2 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-sm mb-1">Casting Spells...</div>
            <div className="wizard-hat w-12 h-12 mx-auto"></div>
          </div>
        </div>

        <div className="w-full border border-white p-2 mb-2">
          <h2 className="text-white text-center font-bold mb-2">
            ARTUR SHIROKOV
          </h2>
          <p className="text-white text-xs text-center">Full Stack Developer</p>
          <p className="text-white text-xs text-center mt-1">Lisbon, PT</p>
        </div>

        <div className="w-full flex justify-between">
          <button className="w-12 h-12 border border-white flex items-center justify-center">
            <div className="w-6 h-6 bg-white mask-icon-code"></div>
          </button>
          <button className="w-12 h-12 border border-white flex items-center justify-center">
            <div className="w-6 h-6 bg-white mask-icon-wand"></div>
          </button>
          <button className="w-12 h-12 border border-white flex items-center justify-center">
            <div className="w-6 h-6 bg-white mask-icon-book"></div>
          </button>
        </div>
      </div>
    </Window>
  );
}
