import { useEffect, useState } from 'react';
import { ShoppingCartIcon } from '../../../assets/ShoppingCartIcon';
import { useCartRecoil } from '../../../hooks/recoil/useCartRecoil';
import { Counter } from '../../../layout/counter/Counter';
import { useCartFetch } from '../../../hooks/fetch/useCartFetch';
import Loading from '../../common/Loading';

interface AddCartButtonProps {
  productId: number;
}

export const AddCartButton = ({ productId }: AddCartButtonProps) => {
  const {
    addRecoilCartById,
    deleteRecoilCartById,
    patchRecoilCartItemQuantity,
    getProductQuantityByCartId,
    getCartHasProduct,
    getCartIdByProductId,
    cartItems,
  } = useCartRecoil();
  const { addCartItemByProductId, deleteCartItemById, patchCartItemQuantity } =
    useCartFetch();

  const [quantity, setQuantity] = useState<number | undefined>(() => {
    const cartId = getCartIdByProductId(productId);

    if (cartId === undefined) return 1;

    return getProductQuantityByCartId(cartId);
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClickShoppingCartIcon = () => {
    setIsLoading(true);
    addCartItemByProductId(productId).then((response) => {
      const cartId = response.headers
        .get('Location')
        ?.replace('/cart-items/', '');

      addRecoilCartById(Number(cartId), productId);
      setIsLoading(false);
    });
  };

  const deleteCartItem = () => {
    const cartId = getCartIdByProductId(productId);

    if (cartId === undefined) return;

    deleteRecoilCartById(cartId);
    deleteCartItemById(cartId);
  };

  const patchQuantity = () => {
    const cartId = getCartIdByProductId(productId);

    if (quantity === undefined) return;
    if (cartId === undefined) return;

    patchRecoilCartItemQuantity(cartId, quantity);
    patchCartItemQuantity(cartId, quantity);
  };

  useEffect(() => {
    if (!getCartHasProduct(productId)) return;
    if (quantity === undefined) return;

    if (quantity <= 0) {
      deleteCartItem();
      setQuantity(1);
      return;
    }

    patchQuantity();
  }, [quantity]);

  useEffect(() => {
    const cartId = getCartIdByProductId(productId);

    if (cartId === undefined) return;

    setQuantity(getProductQuantityByCartId(cartId));
  }, [cartItems]);

  return (
    <>
      {getCartHasProduct(productId) ? (
        <Counter count={quantity} setCount={setQuantity} />
      ) : isLoading ? (
        <Loading />
      ) : (
        <ShoppingCartIcon handleClick={handleClickShoppingCartIcon} />
      )}
    </>
  );
};
