import { http, HttpResponse } from 'msw';
import type { ApiEnvelope } from '@/api/envelope';
import type { DirectoryInfo } from '@/types/identityhub';
import { mock_directories } from '@/mocks/fixtures/directory';

const OK = '0';

/** 目录域列表 —— Mock 模式下提供数据源，供切换器/目录页/作用域解析使用。 */
export const directory_handlers = [
  http.get('/api/identityhub/v1/directory/list', () =>
    HttpResponse.json<ApiEnvelope<{ list: DirectoryInfo[]; total: number }>>({
      code: OK,
      msg: '',
      data: { list: mock_directories, total: mock_directories.length },
    }),
  ),
];
