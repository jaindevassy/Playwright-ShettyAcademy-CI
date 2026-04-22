import { APIRequestContext, expect } from '@playwright/test';

export class ApiUtils {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getLoginToken(email: string, password: string): Promise<string> {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/api/ecom/auth/login`,
      {
        data: { userEmail: email, userPassword: password },
      }
    );
    expect(response.ok).toBeTruthy
    const body = await response.json();
    return body.token;
  }

  async getLoginTokenWithEnvCredentials(): Promise<string> {
    return this.getLoginToken(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  }

  async createOrder(token: string, productId: string, country: string) {
    const response = await this.request.post(
      `${process.env.API_BASE_URL}/api/ecom/order/create-order`,
      {
        data: {
          orders: [{ country, productOrderedId: productId }],
        },
        headers: { Authorization: token, 'Content-Type': 'application/json' },
      }

    );
    expect(response.ok).toBeTruthy
    return response.json();
  }

  async getOrders(token: string) {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/api/ecom/order/get-orders-for-customer`,
      { headers: { Authorization: token } }
    );
    expect(response.ok).toBeTruthy
    return response.json();
  }

  async deleteOrder(token: string, orderId: string) {
    const response = await this.request.delete(
      `${process.env.API_BASE_URL}/api/ecom/order/delete-order/${orderId}`,
      { headers: { Authorization: token } }
    );
    expect(response.ok).toBeTruthy
    return response.json();
  }

  async getProductId(token: string, productName: string): Promise<string> {
    const response = await this.request.get(
      `${process.env.API_BASE_URL}/api/ecom/product/get-all-products`,
      { headers: { Authorization: token } }
    );
    const body = await response.json();
    const product = body.data.find(
      (p: { productName: string }) => p.productName === productName
    );
    expect(response.ok).toBeTruthy
    return product._id;
  }

  async addToCart(token: string, productId: string): Promise<void> {
    await this.request.post(
      `${process.env.API_BASE_URL}/api/ecom/user/add-to-cart`,
      {
        data: { productId },
        headers: { Authorization: token },
      }
    );
  }
}
