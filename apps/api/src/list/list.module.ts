import { Module } from '@nestjs/common';

import { ListController } from './controllers/list.controller';
import { ListItemController } from './controllers/list-item.controller';
import { SystemListItemController } from './controllers/system-list-item.controller';
import { UserListController } from './controllers/user-list.controller';
import { ListService } from './services/list.service';
import { ListItemService } from './services/list-item.service';

@Module({
  controllers: [
    ListItemController,
    ListController,
    SystemListItemController,
    UserListController,
  ],
  providers: [ListService, ListItemService],
  exports: [ListService, ListItemService],
})
export class ListModule {}
