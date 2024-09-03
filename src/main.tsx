import { Plugin, type App, type PluginManifest } from 'obsidian';
import { createStore, unwrap, type Store, type SetStoreFunction  } from 'solid-js/store';
import { render } from 'solid-js/web';
import { PluginSolidSettingTab } from './solidify';
import backend from './backend';
import SettingTab from './components/SettingTab';
import CodeBlock from './components/CodeBlock';
import SETTING_DEFAULT, { type PluginSetting } from './setting';

export default class CodeEmitterPlugin extends Plugin {
  readonly settings: Store<PluginSetting>;
  readonly settingsUpdate: SetStoreFunction<PluginSetting>;

  public constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    const [settings, settingsUpdate ] = createStore(SETTING_DEFAULT);
    this.settings = settings;
    this.settingsUpdate = settingsUpdate;
  }

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new PluginSolidSettingTab(
      this,
      SettingTab,
      {
        settings: this.settings,
        settingsUpdate: this.settingsUpdate,
      }
    ));

    // 检测预览模式
    const isPreviewMode = () => {
      const previewElements = document.querySelectorAll('.markdown-preview-view');
      return previewElements.length > 0;
    };

    if (!isPreviewMode()) {
      Object.keys(backend).forEach(lang => {
        if (lang.includes('+') || lang.includes('#')) {
          return;
        }
        this.registerMarkdownCodeBlockProcessor(lang, async (source, el, ctx) => {
          render(() => <CodeBlock
            lang={lang}
            code={source}
            sourcePath={ctx.sourcePath}
            autoRun={this.settings.autoRun} />, 
          el);
        }, -1);
      });
    }
  }

  async unload() {
    await this.saveSettings();
    super.unload();
  }

  async loadSettings(): Promise<void> {
    this.settingsUpdate(Object.assign({}, SETTING_DEFAULT, await this.loadData()));
  }

  async saveSettings(): Promise<void> {
    await this.saveData(unwrap(this.settings));
  }
}

