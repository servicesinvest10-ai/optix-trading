export const tradingService = {
  placeOrder: async (data) => {
    console.log("Ordre reçu:", data);
    return { success: true };
  }
};