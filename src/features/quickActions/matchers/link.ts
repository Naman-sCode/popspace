import { TFunction } from 'i18next';
import { WidgetType } from '../../../roomState/types/widgets';
import { QuickAction, QuickActionKind } from '../types';

export function linkQuickActions(prompt: string, t: TFunction): QuickAction[] {
  if (!prompt) {
    // this accessory shows a default option in the empty state
    return [
      {
        kind: QuickActionKind.AddAccessory,
        icon: WidgetType.Link,
        accessoryType: WidgetType.Link,
        displayName: t('widgets.link.quickActionTitle'),
        accessoryData: {
          url: '',
          title: 'Link',
        },
        confidence: 5,
      },
    ];
    // excluding starting with #, since that is a valid URL but not
    // probably what the user intended
  } else if (!prompt.startsWith('#')) {
    try {
      // throws if the string is not a valid URL
      new URL(prompt);
      return [
        {
          kind: QuickActionKind.AddAccessory,
          icon: WidgetType.Link,
          accessoryType: WidgetType.Link,
          displayName: t('widgets.link.quickActionTitle'),
          accessoryData: {
            url: prompt,
            title: prompt,
          },
          confidence: 8,
        },
      ];
    } catch (err) {
      // it's not a link verbatim, check more options below
    }
  }

  const iframeMatch = /^<iframe .*src="(.+?)".*<\/iframe>$/.exec(prompt);
  if (iframeMatch) {
    const src = iframeMatch[1];
    try {
      new URL(src);
      return [
        {
          kind: QuickActionKind.AddAccessory,
          icon: 'embed',
          accessoryType: WidgetType.Link,
          displayName: t('widgets.link.quickActionAddEmbed'),
          accessoryData: {
            url: src,
            title: t('widgets.link.embedTitle'),
            iframeUrl: src,
            showIframe: true,
          },
          confidence: 8,
        },
      ];
    } catch (err) {
      // malformed iframe tag, keep going below.
    }
  }

  return [];
}
