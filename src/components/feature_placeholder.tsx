import { Empty } from 'antd';
import { use_t } from '@/lib/i18n';
import type { Dict } from '@/i18n/types';
import './feature_placeholder.css';

/** 未实现功能页的占位卡片（阶段 4-6 逐页替换）。 */
export function FeaturePlaceholder({ feature_key }: { feature_key: keyof Dict }) {
  const t = use_t();
  return (
    <div className="feature-placeholder">
      <Empty description={t(feature_key)} />
      <p className="feature-placeholder__hint">{t('feature.coming_soon')}</p>
    </div>
  );
}
