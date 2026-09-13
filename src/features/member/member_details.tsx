import { useQuery } from '@tanstack/react-query';
import { Descriptions, Drawer, Tag } from 'antd';
import { get_user } from '@/api/user';
import { use_t } from '@/lib/i18n';
import './member_details.css';

interface MemberDetailsProps {
  user_code: string | null;
  on_close: () => void;
}

/** 成员详情抽屉 —— 数据走真实网关 get_user。 */
export function MemberDetails({ user_code, on_close }: MemberDetailsProps) {
  const t = use_t();
  const { data: detail, isLoading } = useQuery({
    queryKey: ['user', 'detail', user_code],
    queryFn: () => get_user(user_code ?? ''),
    enabled: user_code != null,
  });

  return (
    <Drawer title={t('member.detail')} open={user_code != null} onClose={on_close} width={420}>
      {isLoading || detail == null ? (
        <p className="member-details__loading">…</p>
      ) : (
        <Descriptions
          column={1}
          size="small"
          items={[
            { key: 'name', label: t('member.name'), children: detail.name },
            { key: 'email', label: t('member.email'), children: detail.email || '—' },
            {
              key: 'country_code',
              label: t('member.country_code'),
              children: detail.country_code || '—',
            },
            { key: 'phone', label: t('member.phone'), children: detail.phone || '—' },
            {
              key: 'organization_code',
              label: t('member.organization'),
              children: detail.organization_code || '—',
            },
            {
              key: 'source',
              label: t('member.source'),
              children: <Tag>{detail.source}</Tag>,
            },
            {
              key: 'external_id',
              label: t('member.external_id'),
              children: detail.external_id || '—',
            },
            {
              key: 'status',
              label: t('member.status'),
              children: (
                <Tag color={detail.status === 'enable' ? 'green' : 'default'}>
                  {detail.status === 'enable' ? t('common.enable') : t('common.disable')}
                </Tag>
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
}
