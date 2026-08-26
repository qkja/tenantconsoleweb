import { useQuery } from '@tanstack/react-query';
import { Descriptions, Drawer } from 'antd';
import { get_user } from '@/api/user';
import { use_t } from '@/lib/i18n';
import './member_details.css';

interface MemberDetailsProps {
  user_id: string | null;
  domain: string;
  on_close: () => void;
}

/** 成员详情抽屉 —— 数据走真实网关 get_user（后端 4 个 RPC 之一）。 */
export function MemberDetails({ user_id, domain, on_close }: MemberDetailsProps) {
  const t = use_t();
  const { data: detail, isLoading } = useQuery({
    queryKey: ['user', 'detail', user_id],
    queryFn: () => get_user(user_id ?? '', domain),
    enabled: user_id != null,
  });

  return (
    <Drawer title={t('member.detail')} open={user_id != null} onClose={on_close} width={420}>
      {isLoading || detail == null ? (
        <p className="member-details__loading">…</p>
      ) : (
        <Descriptions
          column={1}
          size="small"
          items={[
            { key: 'display_name', label: t('member.display_name'), children: detail.display_name },
            { key: 'username', label: t('member.username'), children: detail.username },
            { key: 'phone', label: t('member.phone'), children: detail.phone || '—' },
            { key: 'email', label: t('member.email'), children: detail.email || '—' },
            {
              key: 'primary_org',
              label: t('member.primary_org'),
              children: detail.primary_org_id || '—',
            },
            { key: 'status', label: t('member.status'), children: detail.status },
            { key: 'created', label: t('directory.created_at'), children: detail.created_at },
          ]}
        />
      )}
    </Drawer>
  );
}
