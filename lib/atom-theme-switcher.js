"use babel"


import { CompositeDisposable } from "atom"


export default new class AtomThemeSwitcher {
  initialize() {
    const auto_theme_switching = atom.config.get("atom-theme-switcher.autoThemeSwitching")

    if (auto_theme_switching) {
      this.auto()
    }
  }
  
  activate(state) {
    const subscriptions = new CompositeDisposable()

    subscriptions.add(atom.commands.add("atom-workspace", {
      "atom-theme-switcher:switch": () => this.switch(),
      "atom-theme-switcher:auto": () => this.auto()
    }))
  }

  switch() {
    const current_themes = atom.config.get("core.themes")
    const ui_theme_one = atom.config.get("atom-theme-switcher.uiThemeOne")
    const ui_theme_two = atom.config.get("atom-theme-switcher.uiThemeTwo")
    const syntax_theme_one = atom.config.get("atom-theme-switcher.syntaxThemeOne")
    const syntax_theme_two = atom.config.get("atom-theme-switcher.syntaxThemeTwo")
    
    let changed_themes = []
  
    if (current_themes[0] == ui_theme_one) {
      changed_themes[0] = ui_theme_two
    } else {
      changed_themes[0] = ui_theme_one
    }
  
    if (current_themes[1] == syntax_theme_one) {
      changed_themes[1] = syntax_theme_two
    } else {
      changed_themes[1] = syntax_theme_one
    }
  
    atom.config.set("core.themes", changed_themes)
  }
  
  auto() {
    const now = new Date()
    const current_time_point_mm = (now.getHours() * 60) + now.getMinutes()
    const first_time_point = atom.config.get("atom-theme-switcher.firstTimePoint").split(":")
    const first_time_point_mm = (Number(first_time_point[0]) * 60) + Number(first_time_point[1])
    const second_time_point = atom.config.get("atom-theme-switcher.secondTimePoint").split(":")
    const second_time_point_mm = (Number(second_time_point[0]) * 60) + Number(second_time_point[1])
    const update_interval = (atom.config.get("atom-theme-switcher.updateInterval") * 1000 * 60) + 1000
    const ui_theme_one = atom.config.get("atom-theme-switcher.uiThemeOne")
    const ui_theme_two = atom.config.get("atom-theme-switcher.uiThemeTwo")
    const syntax_theme_one = atom.config.get("atom-theme-switcher.syntaxThemeOne")
    const syntax_theme_two = atom.config.get("atom-theme-switcher.syntaxThemeTwo")
    
    let changed_themes = []
    
    if (current_time_point_mm >= first_time_point_mm) {
      changed_themes = [ui_theme_one, syntax_theme_one]
    }
    
    if (current_time_point_mm >= second_time_point_mm) {
      changed_themes = [ui_theme_two, syntax_theme_two]
    }
    
    if (changed_themes[0] == "" || changed_themes[1] == "") {
      changed_themes = [ui_theme_one, syntax_theme_one]
    }
    
    atom.config.set("core.themes", changed_themes)
    
    setTimeout(() => {
      this.auto()
    }, update_interval)
  }
}