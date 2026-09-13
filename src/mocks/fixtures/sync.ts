import type {
  SyncConfigInfo,
  SyncRecordFailureInfo,
  SyncRecordInfo,
} from '@/types/identityhub';

/** MSW 同步配置夹具 —— 挂在 ldap 目录域下。 */
export const mock_sync_configs: SyncConfigInfo[] = [
  {
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCQ',
    provider: 'ldap',
    server_url: 'ldap://ldap.example.com:389',
    base_dn: 'ou=people,dc=example,dc=com',
    bind_dn: 'cn=admin,dc=example,dc=com',
    external_id_field: 'entryUUID',
    field_mappings: [
      { external_field: 'cn', local_field: 'name' },
      { external_field: 'mail', local_field: 'email' },
    ],
    sync_interval_minutes: 60,
    enabled: true,
    scope_organization: true,
    scope_user: true,
    scope_user_role: true,
    last_sync_at: 1757808000,
    last_sync_status: 'partial',
    created_at: 1757721600,
    updated_at: 1757721600,
  },
];

/** MSW 同步记录夹具 —— append-only。 */
export const mock_sync_records: SyncRecordInfo[] = [
  {
    sync_record_code: 'syn_01HX8ZKP2UD6G1R9F5T3WAM7QBS',
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCQ',
    trigger_type: 'scheduled',
    status: 'partial',
    started_at: 1757808000,
    finished_at: 1757808060,
    total_count: 120,
    success_count: 118,
    failed_count: 2,
  },
  {
    sync_record_code: 'syn_01HX8ZKP2UD6G1R9F5T3WAM7QBT',
    directory_code: 'dir_01HX8ZK5Q2RB3X0F6S8VZD4NCQ',
    trigger_type: 'manual',
    status: 'success',
    started_at: 1757721600,
    finished_at: 1757721650,
    total_count: 115,
    success_count: 115,
    failed_count: 0,
  },
];

/** MSW 同步失败明细夹具 —— 字段对齐独立集合 sync_failures。 */
export const mock_sync_failures: SyncRecordFailureInfo[] = [
  {
    sync_failure_code: 'syf_01HX8ZKR4WF8K2S0G6U4XBN8RCA',
    user_code: 'usr_01HX8ZK7S4TD5Z2H8V0WBF6PET',
    external_id: 'ext-1003',
    reason: '邮箱格式不合法',
    created_at: 1757808060,
  },
  {
    sync_failure_code: 'syf_01HX8ZKR4WF8K2S0G6U4XBN8RCB',
    user_code: '',
    external_id: 'ext-1004',
    reason: '外部记录缺失匹配键',
    created_at: 1757808060,
  },
];
