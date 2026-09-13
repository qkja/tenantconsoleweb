import { Card } from 'antd';
import { useState } from 'react';
import { OrgTree } from '@/components/org_tree/org_tree';
import { UserTable } from '@/components/data_table/user_table';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { use_t } from '@/lib/i18n';
import { use_scope } from '@/stores/scope';
import type { OrganizationInfo } from '@/types/identityhub';
import './member_page.css';

/** 成员管理 —— 企微通讯录双栏：左组织树 + 右成员表。 */
export function MemberPage() {
  const t = use_t();
  const { directory_code } = use_scope();
  const { data: directories = [] } = use_directory_list();
  const [org, set_org] = useState<OrganizationInfo | null>(null);

  const dir_code = directory_code ?? directories[0]?.directory_code ?? '';

  return (
    <div className="member-page">
      <Card className="member-page__tree-card" title={t('organization.title')}>
        <OrgTree
          directory_code={dir_code}
          selected_id={org?.organization_code ?? null}
          on_select={set_org}
        />
      </Card>

      <Card className="member-page__table-card" title={t('member.title')}>
        <UserTable directory_code={dir_code} organization_code={org?.organization_code ?? null} />
      </Card>
    </div>
  );
}
