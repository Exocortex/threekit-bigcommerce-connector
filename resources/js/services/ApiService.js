
export const ApiService = {
  // Get all scripts in the store
  getBrandProducts(resource, params) {
    return axios({
      method: 'get',
      url: `/bc-api/${resource}`,
      params,
    });
  },
  getScripts(resource, params) {
    return axios({
      method: 'get',
      url: `/bc-api/${resource}`,
      params,
    });
  },
  getToken(params) {
    return axios({
      method: 'get',
      url: `/api/threekit`,
      params,
    });
  },
  addToken(data) {
    return axios({
      method: 'post',
      url: `/api/threekit`,
      data,
    });
  },
  // Add a script to the store
  addScript(resource, data) {
    return axios({
      method: 'post',
      url: `/bc-api/${resource}`,
      data,
    });
  },
  getOrders(params) {
    params = Object.assign({
      page: 1,
      limit: 10,
    }, params);

    return axios({
      method: 'get',
      url: '/bc-api/v2/orders',
      params,
    });
  },

  updateOrder(orderId, data) {
    return axios({
      method: 'put',
      url: `/bc-api/v2/orders/${orderId}`,
      data,
    });
  },

  deleteOrder(orderId) {
    return axios({
      method: 'delete',
      url: `/bc-api/v2/orders/${orderId}`,
    });
  },

  getResourceCollection(resource, params) {
    params = Object.assign({
      page: 1,
      limit: 10,
    }, params);

    return axios({
      method: 'get',
      url: `/bc-api/${resource}`,
      params,
    });
  },

  getResourceEntry(resource, params) {
    return axios({
      method: 'get',
      url: `/bc-api/${resource}`,
      params,
    });
  },

  updateResourceEntry(resource, data) {
    return axios({
      method: 'put',
      url: `/bc-api/${resource}`,
      data,
    });
  },
  createResourceEntry(resource, data) {
    return axios({
      method: 'post',
      url: `/bc-api/${resource}`,
      data,
    });
  },

  deleteResourceEntry(resource, data) {
    return axios({
      method: 'delete',
      url: `/bc-api/${resource}`,
    });
  },
};
