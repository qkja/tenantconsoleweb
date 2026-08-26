import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
/* eslint-disable react-hooks/rules-of-hooks --
   use_i18n/use_t 按项目命名指令以 use_ 前缀 snake_case 命名，
   react-hooks 插件仅识别 useXxx 驼峰 hook 名，此处豁免其 hook 环境校验 */
import { en_us } from '@/i18n/en_us';
import { zh_cn } from '@/i18n/zh_cn';
import type { Dict } from '@/i18n/types';

export type Language = 'zh_CN' | 'en_US';

const dictionaries: Record<Language, Dict> = {
  zh_CN: zh_cn,
  en_US: en_us,
};

interface I18nContextValue {
  language: Language;
  set_language: (language: Language) => void;
  t: (key: keyof Dict, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, set_language] = useState<Language>('zh_CN');

  const t = useCallback(
    (key: keyof Dict, vars?: Record<string, string | number>) => {
      let text = dictionaries[language][key] ?? String(key);
      if (vars != null) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [language],
  );

  const value = useMemo(() => ({ language, set_language, t }), [language, set_language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function use_i18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (context == null) {
    throw new Error('use_i18n must be used within I18nProvider');
  }
  return context;
}

/** 取翻译函数 t，组件常用。 */
export function use_t() {
  return use_i18n().t;
}
