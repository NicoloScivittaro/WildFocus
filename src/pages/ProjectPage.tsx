import { ProjectConfigurator } from '@/components/forms/ProjectConfigurator'
import { Seo } from '@/seo/Seo'

export default function ProjectPage() {
  return (
    <>
      <Seo
        title="Start a project — WildFocus"
        description="Configura il tuo progetto in quattro passi: cosa realizziamo, obiettivo, budget, deadline e riferimenti. Poi ti diciamo come procedere."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ProjectConfigurator />
      </div>
    </>
  )
}
