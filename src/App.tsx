import { RecoilRoot } from 'recoil';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Main from './pages/Main';
import { Cart } from './pages/Cart';

export const App = () => {
  return (
    <RecoilRoot>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </HashRouter>
    </RecoilRoot>
  );
};
