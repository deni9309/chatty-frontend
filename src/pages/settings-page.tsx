import PreviewMessages from '../components/daisy-ui/preview-messages'
import ThemeSwitcher from '../components/daisy-ui/theme-switcher'


const SettingsPage = () => {
  return (
    <div className="container h-screen mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <ThemeSwitcher />
        <PreviewMessages />
      </div>
    </div>
  )
}

export default SettingsPage
