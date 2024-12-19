export const addOrdersQuery =
  "INSERT INTO orders (order_id,product_id,buyer_id,quantity,price,description,category,created_at,updated_at,owner_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING order_id,product_id,buyer_id,quantity,price,description,category,created_at,updated_at,owner_id ";

export const getOrderQuery = "SELECT * FROM orders WHERE owner_id=$1";
export const getOrderItemById = "SELECT * FROM orders WHERE order_id=$1";

export const deleteOrderQuery = "DELETE FROM orders WHERE order_id=$1";
