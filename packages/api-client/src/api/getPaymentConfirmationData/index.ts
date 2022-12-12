import axios from 'axios';
import { ApiContext } from '../../types';
import getCurrentBearerOrCartToken from '../authentication/getCurrentBearerOrCartToken';
import getAuthorizationHeaders from '../authentication/getAuthorizationHeaders';
import { Logger } from '@vue-storefront/core';

export default async function getPaymentConfirmationData({ client, config }: ApiContext) {
  try {
    const token = await getCurrentBearerOrCartToken({ client, config });
    const currency = await config.internationalization.getCurrency();
    const endpoint = config.backendUrl.concat('/api/v2/storefront/intents/payment_confirmation_data');
    const response = await axios.post(
      endpoint, {
        currency: currency
      },
      {
        headers: getAuthorizationHeaders(token)
      }
    );

    return { clientSecret: response.data.client_secret };
  } catch (e) {
    Logger.error(e);
    throw e;
  }
}
