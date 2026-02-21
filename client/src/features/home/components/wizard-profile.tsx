import { useQuery } from '@tanstack/react-query'
import { queryOptions } from '@tanstack/react-query'
import { fetchAPI } from '@/shared/lib/api-client'
import Window from '@/shared/components/layout/window'
import type { Profile } from '@shared/types'

const profileQueryOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: () => fetchAPI<Profile>('/content/profile'),
})

export default function WizardProfile() {
  const { data: profile } = useQuery(profileQueryOptions)

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
            <div className="text-sm mb-1">{profile?.avatar?.animation ?? 'Casting Spells...'}</div>
            <div className="wizard-hat w-12 h-12 mx-auto"></div>
          </div>
        </div>

        <div className="w-full border border-white p-2 mb-2">
          <h2 className="text-white text-center font-bold mb-2 glow-text">
            {profile?.name ?? 'ARTUR SHIROKOV'}
          </h2>
          <p className="text-white text-xs text-center text-subtitle">{profile?.title ?? 'Software Engineer'}</p>
          {profile?.tagline && (
            <p className="text-white/60 text-xs text-center mt-1">{profile.tagline}</p>
          )}
          <p className="text-white text-xs text-center mt-1">{profile?.location ?? 'Lisbon, PT'}</p>
        </div>

        <div className="w-full flex justify-between">
          <button className="pixel-button w-12 h-12 flex items-center justify-center">
            <div className="w-6 h-6 bg-white mask-icon-code"></div>
          </button>
          <button className="pixel-button w-12 h-12 flex items-center justify-center">
            <div className="w-6 h-6 bg-white mask-icon-wand"></div>
          </button>
          <button className="pixel-button w-12 h-12 flex items-center justify-center">
            <div className="w-6 h-6 bg-white mask-icon-book"></div>
          </button>
        </div>
      </div>
    </Window>
  )
}
