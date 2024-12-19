export const addToCartQuery =
  "INSERT INTO cart (cart_id,buyer_id,product_id,quantity,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6)RETURNING cart_id,buyer_id,product_id,quantity,created_at,updated_at";

export const getItemInCartquery = "SELECT * FROM cart Where buyer_id=$1";
export const getCartItemById = "SELECT * FROM cart WHERE cart_id=$1";
export const getProductByID = "SELECT * FROM cart WHERE product_id=$1";

export const updateCartItem =
  "UPDATE cart SET buyer_id=$1,product_id=$2,quantity=$3,updated_at=$4 WHERE cart_id=$5 RETURNING buyer_id, buyer_id,product_id,quantity";

export const deleteCartItemQuery = "DELETE FROM cart Where cart_id=$1";
export const deleteUserItemsQuery = "DELETE FROM cart WHERE buyer_id=$1";

export const cartItemsQuery =
  "SELECT owner_id, product_id, name,description,price,quantity,category,created_at,updated_at FROM products Where product_id=$1";

export const UpdateQuantityQuery =
  "UPDATE products SET quantity =quantity-$1 WHERE product_id =$2";
