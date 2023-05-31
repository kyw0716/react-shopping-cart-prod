import { selector } from 'recoil';
import { cartItemsState, selectedCartIdListState } from '../atoms/cartAtom';
import { userAtomState } from '../atoms/userAtom';

export const priceSummaryState = selector({
  key: 'priceSummaryState',
  get: ({ get }) => {
    const selectedCartItems = get(selectedCartIdListState);
    const cartItems = get(cartItemsState);
    const userPoint = get(userAtomState);

    const totalProductPrice = selectedCartItems.reduce(
      (acc, selectedCartItemId) => {
        const product = cartItems.find(
          (cartProduct) => cartProduct.id === selectedCartItemId
        );

        return (acc +=
          Number(product?.quantity) * Number(product?.product.price));
      },
      0
    );

    const totalAvailablePoints = selectedCartItems.reduce(
      (acc, selectedCartItemId) => {
        const product = cartItems.find(
          (cartProduct) => cartProduct.id === selectedCartItemId
        );

        if (product?.product.pointAvailable === true)
          return (acc +=
            Number(product?.quantity) * Number(product?.product.price));

        return (acc += 0);
      },
      0
    );

    const totalPointsToAdd = selectedCartItems.reduce(
      (acc, selectedCartItemId) => {
        const product = cartItems.find(
          (cartProduct) => cartProduct.id === selectedCartItemId
        );

        return (acc +=
          (Number(product?.quantity) *
            Number(product?.product.price) *
            Number(product?.product.pointRatio)) /
          100);
      },
      0
    );

    const deliveryPrice = selectedCartItems.length > 0 ? 3000 : 0;

    const totalPrice = totalProductPrice + deliveryPrice;

    const canUsingUserPoint =
      totalAvailablePoints > userPoint ? userPoint : totalAvailablePoints;

    return {
      totalProductPrice,
      deliveryPrice,
      totalPrice,
      canUsingUserPoint,
      totalPointsToAdd,
      userPoint,
    };
  },
});
