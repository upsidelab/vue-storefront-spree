import { Logger } from '@vue-storefront/core';
import { ApiContext } from '../../types';
import type { RequiredAnyToken, OrderAttr } from '@spree/storefront-api-v2-sdk';
import getCurrentBearerOrCartToken from '../authentication/getCurrentBearerOrCartToken';

export default async function saveGuestCheckoutEmail(
  { client, config }: ApiContext,
  email: string
): Promise<OrderAttr> {
  try {
    const token = await getCurrentBearerOrCartToken({ client, config }) as RequiredAnyToken;
    const currency = await config.internationalization.getCurrency();
    const result = await client.checkout.orderUpdate({
      ...token,
      order: {
        email
      },
      currency
    });

    if (result.isFail()) {
      throw result.fail();
    }
    return result.success().data;
  } catch (e) {
    Logger.error(e);
    throw e;
  }
}
