import type { ThemeConfig } from 'antd';

/**
 * 色板 —— 与 src/styles/tokens.css 的 CSS 变量一一对应（hex 同值）。
 * antd 的 theme token 只能吃具体色值，无法引用 CSS 变量；
 * 两处保持同值，改色只改 tokens.css 与这里两处。
 */
export const palette = {
  primary: '#166CDD',
  primary_bg: '#EDF4FE',
  text: '#1F2733',
  text_secondary: '#5C6672',
  text_tertiary: '#8A94A3',
  surface: '#FFFFFF',
  layout_bg: '#F4F6FA',
  border: '#E3E8EF',
  border_strong: '#C9D2DE',
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
} as const;

export const app_theme: ThemeConfig = {
  token: {
    colorPrimary: palette.primary,
    colorInfo: palette.primary,
    colorSuccess: palette.success,
    colorWarning: palette.warning,
    colorError: palette.error,
    colorBgLayout: palette.layout_bg,
    colorBgContainer: palette.surface,
    colorBorder: palette.border,
    colorBorderSecondary: palette.border,
    colorText: palette.text,
    colorTextSecondary: palette.text_secondary,
    colorTextTertiary: palette.text_tertiary,
    borderRadius: 8,
    fontSize: 14,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Layout: {
      headerBg: palette.surface,
      siderBg: palette.surface,
      headerHeight: 56,
      headerPadding: '0 24px',
    },
    Menu: {
      itemHeight: 40,
      itemBorderRadius: 8,
      itemColor: palette.text_secondary,
      itemHoverBg: '#F2F5FA',
      itemSelectedBg: palette.primary_bg,
      itemSelectedColor: palette.primary,
      activeBarBorderWidth: 0,
    },
    Table: {
      headerBg: '#F7F9FC',
      headerColor: palette.text_secondary,
      rowHoverBg: '#FAFBFF',
    },
    Card: {
      paddingLG: 24,
    },
  },
};
