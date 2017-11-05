import highlightJs from 'highlight.js';
import 'highlight.js/styles/solarized-light.css';

// eslint-disable-next-line import/prefer-default-export
export function getStoryInfo(story) {
  // const componentName = /\/([^/]+)\.hbs/gi.exec(story.path)[1];

  const data = {
    story: story.name,
    label: story.label,
    description: story.description,
    templateSource: story.source.template.replace(/(^\s+|\s+$)/gi, ''),
    styleSource: story.source.style && story.source.style.replace(/(^\s+|\s+$)/gi, ''),
    scriptSource: story.source.script && story.source.script.replace(/(^\s+|\s+$)/gi, ''),
    path: story.path,
    variant: story.variant,
    rendered: story.template.compiled(story.props),
    usage: story.template.raw,
    tabData: {
      tabId: Math.random(),
      tabs: [{ label: 'Example' }, { label: 'Data' }, { label: 'HTML' }, { label: 'Handlebars' }],
    },
    data: story.props,
    component: null,
  };

  // if (variant) {
  // 	data.variant = variant;
  // }

  data.component = data.rendered
    .replace(/(^\s+|\s+$)/gi, '')
    .replace(/^\s*<!-- partial: [^ ]+ -->/i, '')
    .replace(/<!-- \/ [^ ]+ -->\s*$/i, '')
    .replace(/(^\s+|\s+$)/gi, '');

  if (data.styleSource) {
    data.tabData.tabs.push({ label: 'Style' });
    data.styleSource = highlightJs
      .highlight('scss', data.styleSource.replace(/\t/gi, '  '))
      .value.replace(/\n/gi, '<br />');
  }
  if (data.scriptSource) {
    data.tabData.tabs.push({ label: 'Script' });
    data.scriptSource = highlightJs
      .highlight('typescript', data.scriptSource.replace(/\t/gi, '  '))
      .value.replace(/\n/gi, '<br />');
  }

  data.usage = highlightJs
    .highlight('handlebars', data.usage.replace(/\t/gi, '  '))
    .value.replace(/\n/gi, '<br />');

  data.templateSource = highlightJs
    .highlight('handlebars', data.templateSource.replace(/\t/gi, '  '))
    .value.replace(/\n/gi, '<br />');

  data.component = highlightJs
    .highlight('html', data.component.replace(/\t/gi, '  '))
    .value.replace(/\n/gi, '<br />');

  data.data = highlightJs
    .highlight('json', JSON.stringify(story.props, null, '  '))
    .value.replace(/\n/gi, '<br />');

  return data;
}
