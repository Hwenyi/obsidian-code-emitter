import Play from './Play';
import { loadPrism } from 'obsidian';

export default (props: { lang: string, code: string, sourcePath: string, autoRun: boolean } ) => {
  const highlightElement = async (el: HTMLElement) => {
    const prism = await loadPrism();
    prism.highlightElement(el);
  };

  const language = () => `language-${props.lang}`;

  // 检测阅读模式
  const isReadingMode = () => {
    const readingModeElements = document.querySelectorAll('.markdown-preview-view');
    return readingModeElements.length > 0;
  };

  if (isReadingMode()) {
    return null;
  }

  return <>
    <pre class={ language() }>
      <code ref={highlightElement}>{props.code}</code>
      <Play {...props}/>
    </pre>
  </>;
};