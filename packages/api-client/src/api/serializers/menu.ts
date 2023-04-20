import { JsonApiDocument } from '@spree/storefront-api-v2-sdk';
import { Menu } from '../../types';

const findItems = (menu, apiMenus) => {
  if (menu.attributes.is_leaf) return [];

  const menuIds = menu.relationships.children.data.map(child => child.id);
  const items = apiMenus.filter(menu => menuIds.includes(menu.id));

  return items.map(item => ({
    id: item.id,
    name: item.attributes.name,
    link: item.attributes.link,
    items: findItems(item, apiMenus)
  }));
};

export const deserializeMenu = (apiMenus: JsonApiDocument[]): Menu[] =>
  apiMenus.map<Menu>(menu => ({
    id: parseInt(menu.id),
    name: menu.attributes.name,
    link: menu.attributes.link,
    items: findItems(menu, apiMenus)
  }));
