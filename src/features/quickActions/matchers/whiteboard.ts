import { TFunction } from 'i18next';
import { WidgetType } from '../../../roomState/types/widgets';
import { QuickAction, QuickActionKind } from '../types';

export function whiteboardQuickActions(prompt: string, t: TFunction): QuickAction[] {
  if (!prompt || prompt === t('widgets.whiteboard.quickActionPrompt')) {
    return [
      {
        kind: QuickActionKind.AddAccessory,
        icon: WidgetType.Whiteboard,
        accessoryType: WidgetType.Whiteboard,
        accessoryData: {
          whiteboardState: {
            lines: [],
          },
        },
        // for empty, it's 5 - for /whiteboard, it's 10
        confidence: !prompt ? 5 : 10,
        displayName: t('widgets.whiteboard.quickActionTitle'),
      },
    ];
  }

  return [];
}
