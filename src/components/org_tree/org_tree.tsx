import { App, Tree, type TreeDataNode, type TreeProps } from 'antd';
import { useMemo } from 'react';
import { list_organization_children } from '@/api/organization';
import { use_organization_children } from '@/hooks/queries/use_organization_children';
import type { OrganizationInfo } from '@/types/identityhub';
import './org_tree.css';

interface OrgTreeProps {
  domain: string;
  selected_id: string | null;
  on_select: (node: OrganizationInfo) => void;
}

function to_tree_node(node: OrganizationInfo): TreeDataNode {
  return { key: node.id, title: node.name, isLeaf: false };
}

/** 组织架构树 —— 根节点走 query，深层子级展开时按 parent_id 懒加载（规避 10 QPS 限流）。 */
export function OrgTree({ domain, selected_id, on_select }: OrgTreeProps) {
  const { message } = App.useApp();
  const { data: root_nodes = [] } = use_organization_children(domain, null);

  const tree_data = useMemo(() => root_nodes.map(to_tree_node), [root_nodes]);

  const on_load_data: TreeProps['loadData'] = async (node) => {
    try {
      const data = await list_organization_children({
        domain,
        parent_id: String(node.key),
        page: 1,
        page_size: 500,
      });
      node.children = data.list.map(to_tree_node);
    } catch (error) {
      message.error(error instanceof Error ? error.message : String(error));
      node.children = [];
    }
  };

  return (
    <Tree
      className="org-tree"
      showLine
      blockNode
      treeData={tree_data}
      loadData={on_load_data}
      selectedKeys={selected_id != null ? [selected_id] : []}
      onSelect={(_keys, info) => {
        const node = info.selectedNodes[0];
        if (node != null) {
          on_select({ id: String(node.key) } as OrganizationInfo);
        }
      }}
    />
  );
}
