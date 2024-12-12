export const addToCartQuery =
  "INSERT INTO cart (user_id,product_id,quantity) VALUES ($1,$2,$3)RETURNING user_id,product_id,quantity";

export const getItemInCartquery = "SELECT * FROM cart Where user_id=$1";
export const getCartItemById = "SELECT * FROM cart WHERE id=$1";

export const updateCartItem =
  "UPDATE cart SET user_id=$1,product_id=$2,quantity=$3 WHERE id=$4 RETURNING user_id,product_id,quantity";

export const deleteCartItemQuery = "DELETE FROM cart Where id=$1";
export const deleteUserItemsQuery = "DELETE FROM cart WHERE user_id=$1";
export const cartItemsQuery =
  "SELECT name,description,price,quantity FROM products Where id=$1";

export const UpdateQuantityQuery =
  "UPDATE products SET quantity =quantity-$1 WHERE id =$2";
