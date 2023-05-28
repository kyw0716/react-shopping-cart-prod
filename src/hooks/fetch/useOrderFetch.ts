import { useRecoilValue } from 'recoil';
import { APIAtom } from '../../recoil/atoms/serverAtom';
import { base64 } from '../../constants/user';
import { selectedCartItemsState } from '../../recoil/selectors/cartListSelector';

export const useOrderFetch = () => {
  const apiEndPoint = useRecoilValue(APIAtom);
  const selectedCartItems = useRecoilValue(selectedCartItemsState);

  const order = (usingPoint: number) => {
    return fetch(`${apiEndPoint}/orders`, {
      method: 'POST',
      headers: {
        Autorization: `Basic ${base64}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: selectedCartItems.map((cartItem) => cartItem.id),
        originalPrice: selectedCartItems.reduce((acc, curr) => {
          return (acc += curr.product.price * curr.quantity);
        }, 0),
        usedPoint: usingPoint ?? 0,
        pointToAdd: selectedCartItems.reduce((acc, curr) => {
          const earnedPoint = curr.product.pointAvailable
            ? (curr.product.price * curr.quantity * curr.product.pointRatio) /
              100
            : 0;

          return (acc += earnedPoint);
        }, 0),
      }),
    });
  };

  return { order };
};
