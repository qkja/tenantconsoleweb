import { ProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { useQuery } from '@tanstack/react-query';
import { Drawer, Select, Space, Table, Tag } from 'antd';
import { useState } from 'react';
import { list_sync_record_failures, list_sync_records } from '@/api/sync';
import { use_directory_list } from '@/hooks/queries/use_directory_list';
import { format_unix_time } from '@/lib/format';
import { use_t } from '@/lib/i18n';
import type { SyncRecordFailureInfo, SyncRecordInfo, SyncRecordStatus } from '@/types/identityhub';
import './sync_page.css';

const STATUS_OPTIONS: { value: SyncRecordStatus; label: string }[] = [
  { value: 'success', label: 'success' },
  { value: 'partial', label: 'partial' },
  { value: 'failed', label: 'failed' },
  { value: 'running', label: 'running' },
];

function status_color(status: SyncRecordStatus): string {
  if (status === 'success') {
    return 'green';
  }
  if (status === 'running') {
    return 'blue';
  }
  if (status === 'partial') {
    return 'orange';
  }
  return 'red';
}

function FailuresDrawer({
  sync_record_code,
  on_close,
}: {
  sync_record_code: string | null;
  on_close: () => void;
}) {
  const t = use_t();
  const { data: failures = [], isLoading } = useQuery({
    queryKey: ['sync', 'failures', sync_record_code],
    queryFn: () =>
      list_sync_record_failures({
        sync_record_code: sync_record_code ?? '',
        page: 1,
        page_size: 500,
        sort_by: 'created_at',
        descending: 'desc',
      }),
    enabled: sync_record_code != null,
    select: (data) => data.list,
  });

  return (
    <Drawer
      title={t('sync_records.failures_title')}
      open={sync_record_code != null}
      onClose={on_close}
      width={640}
    >
      <Table<SyncRecordFailureInfo>
        rowKey="sync_failure_code"
        size="small"
        loading={isLoading}
        dataSource={failures}
        pagination={false}
        columns={[
          { title: t('sync_records.failure_code'), dataIndex: 'sync_failure_code', ellipsis: true },
          { title: t('sync_records.user_code'), dataIndex: 'user_code', ellipsis: true },
          { title: t('sync_records.external_id'), dataIndex: 'external_id', ellipsis: true },
          { title: t('sync_records.reason'), dataIndex: 'reason' },
          {
            title: t('sync_records.created_at'),
            dataIndex: 'created_at',
            width: 170,
            render: (_, record) => format_unix_time(record.created_at),
          },
        ]}
      />
    </Drawer>
  );
}

/** 同步记录 —— 每次同步的时间 / 成功数 / 失败数 / 失败明细（sync_failures 口径）。 */
export function SyncRecordPage() {
  const t = use_t();
  const { data: directories = [] } = use_directory_list();
  const [directory_code, set_directory_code] = useState<string | undefined>(undefined);
  const [status, set_status] = useState<SyncRecordStatus | undefined>(undefined);
  const [failures_code, set_failures_code] = useState<string | null>(null);

  const directory_map = new Map(directories.map((dir) => [dir.directory_code, dir.name]));

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['sync', 'records', directory_code ?? 'all', status ?? 'all'],
    queryFn: () =>
      list_sync_records({
        directory_code,
        status,
        page: 1,
        page_size: 500,
        sort_by: 'started_at',
        descending: 'desc',
      }),
    select: (data) => data.list,
    staleTime: 30_000,
  });

  const columns: ProColumns<SyncRecordInfo>[] = [
    {
      title: t('sync_records.code'),
      dataIndex: 'sync_record_code',
      render: (_, record) => <Tag>{record.sync_record_code}</Tag>,
    },
    {
      title: t('sync_records.directory'),
      dataIndex: 'directory_code',
      render: (_, record) => directory_map.get(record.directory_code) ?? record.directory_code,
    },
    {
      title: t('sync_records.trigger_type'),
      dataIndex: 'trigger_type',
      width: 100,
      render: (_, record) =>
        record.trigger_type === 'manual'
          ? t('sync_records.trigger_manual')
          : t('sync_records.trigger_scheduled'),
    },
    {
      title: t('sync_records.status'),
      dataIndex: 'status',
      width: 100,
      render: (_, record) => <Tag color={status_color(record.status)}>{record.status}</Tag>,
    },
    {
      title: t('sync_records.started_at'),
      dataIndex: 'started_at',
      width: 170,
      render: (_, record) => format_unix_time(record.started_at),
    },
    {
      title: t('sync_records.finished_at'),
      dataIndex: 'finished_at',
      width: 170,
      render: (_, record) => format_unix_time(record.finished_at),
    },
    { title: t('sync_records.total_count'), dataIndex: 'total_count', width: 90 },
    { title: t('sync_records.success_count'), dataIndex: 'success_count', width: 90 },
    { title: t('sync_records.failed_count'), dataIndex: 'failed_count', width: 90 },
    {
      title: t('common.actions'),
      valueType: 'option',
      width: 140,
      render: (_, record) => (
        <a onClick={() => set_failures_code(record.sync_record_code)}>
          {t('sync_records.view_failures')}
        </a>
      ),
    },
  ];

  return (
    <div className="sync-page">
      <ProTable<SyncRecordInfo>
        rowKey="sync_record_code"
        columns={columns}
        dataSource={records}
        loading={isLoading}
        search={false}
        pagination={false}
        options={false}
        toolBarRender={() => [
          <Space key="filters">
            <Select
              allowClear
              className="sync-page__dir-select"
              placeholder={t('sync_records.directory')}
              value={directory_code}
              onChange={set_directory_code}
              options={directories.map((dir) => ({ label: dir.name, value: dir.directory_code }))}
            />
            <Select
              allowClear
              className="sync-page__status-select"
              placeholder={t('sync_records.status')}
              value={status}
              onChange={set_status}
              options={STATUS_OPTIONS}
            />
          </Space>,
        ]}
      />

      <FailuresDrawer sync_record_code={failures_code} on_close={() => set_failures_code(null)} />
    </div>
  );
}
