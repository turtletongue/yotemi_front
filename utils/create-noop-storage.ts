const createNoopStorage = () => {
  return {
    async getItem(key: any) {
      return null;
    },
    async setItem(key: any, value: any) {
      return value;
    },
    async removeItem(key: any) {},
  };
};

export default createNoopStorage;
