let orders = [];

export async function loadOrders() {
  const response = await fetch('http://localhost:3000/orders');
  orders = await response.json();
}

export function getOrders() {
  return orders;
}

export async function addOrder(order) {
  await fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  });
}
