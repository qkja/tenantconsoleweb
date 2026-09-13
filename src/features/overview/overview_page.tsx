import { Card, Col, Row, Statistic } from 'antd';
import { use_current_admin } from '@/hooks/queries/use_current_admin';
import { use_t } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import './overview_page.css';

const GRID_GUTTER = 16;

/** 概览页 —— 阶段 1 先展示外壳与设计令牌；统计值阶段 4+ 接入真实 API。 */
export function OverviewPage() {
  const t = use_t();
  const { data: admin } = use_current_admin();
  const { tenant_code } = use_scope();

  const display_name = admin?.name ?? '';

  return (
    <div className="overview-page">
      <header className="overview-page__header">
        <h2 className="page-header__title">{t('overview.welcome')}</h2>
        <p className="page-header__subtitle">
          {display_name ? `${display_name}，` : ''}
          {t('overview.welcome_subtitle')}
        </p>
      </header>

      <Row gutter={[GRID_GUTTER, GRID_GUTTER]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="overview-page__stat-card">
            <Statistic title={t('overview.stat_tenants')} value={tenant_code == null ? '—' : 1} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="overview-page__stat-card">
            <Statistic title={t('overview.stat_directories')} value="—" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="overview-page__stat-card">
            <Statistic title={t('overview.stat_departments')} value="—" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="overview-page__stat-card">
            <Statistic title={t('overview.stat_members')} value="—" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
