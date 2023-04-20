import type { IOAuthToken } from '@spree/storefront-api-v2-sdk';
import { ApiConfig, ApiContext, LogInParams } from '../../types';

async function associateCart(client, config: ApiConfig, guestCartToken: string, bearerToken: IOAuthToken) {
  const response = await client.cart.associateGuestCart({
    bearer_token: bearerToken.access_token,
    guest_order_token: guestCartToken
  });

  if (response.isFail()) {
    throw response.fail();
  }
}

export default async function logIn(
  { client, config }: ApiContext,
  { username, password, guestCartToken }: LogInParams
): Promise<void> {
  const response = await client.authentication.getToken({ username, password });

  if (response.isSuccess()) {
    const bearerToken = response.success();
    await config.auth.changeOAuthToken(bearerToken);

    if (config.spreeFeatures.associateGuestCart && guestCartToken) {
      await associateCart(client, config, guestCartToken, bearerToken);
    }
  } else {
    throw response.fail();
  }
}
