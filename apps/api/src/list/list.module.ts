import { Module } from '@nestjs/common';

import { ArticleModule } from '@/article/article.module';

import { ListController } from './controllers/list.controller';
import { ListItemController } from './controllers/list-item.controller';
import { SystemListItemController } from './controllers/system-list-item.controller';
import { UserListController } from './controllers/user-list.controller';
import { ListMapper } from './list.mapper';
import { ListItemMapper } from './list-item.mapper';
import { ListService } from './services/list.service';
import { ListItemService } from './services/list-item.service';

@Module({
  imports: [ArticleModule],
  controllers: [
    ListItemController,
    ListController,
    SystemListItemController,
    UserListController,
  ],
  providers: [ListService, ListItemService, ListMapper, ListItemMapper],
  exports: [ListService, ListItemService, ListMapper, ListItemMapper],
})
export class ListModule {}
