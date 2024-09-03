import Play from './Play';
import { loadPrism } from 'obsidian';

export default (props: { lang: string, code: string, sourcePath: string, autoRun: boolean } ) => {
  const highlightElement = async (el: HTMLElement) => {
    const prism = await loadPrism();
    prism.highlightElement(el);
  };

  const language = () => `language-${props.lang}`;

  // 检测预览模式
  const isPreviewMode = () => {
    const previewElements = document.querySelectorAll('.markdown-preview-view');
    return previewElements.length > 0;
  };

  if (isPreviewMode()) {
    return null;
  }

  return <>
    <pre class={ language() }>
      <code ref={highlightElement}>{props.code}</code>
      <Play {...props}/>
    </pre>
  </>;
};