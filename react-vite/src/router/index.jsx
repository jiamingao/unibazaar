import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import LandingPage from '../components/LandingPage';
import CreateProduct from '../components/CreateProduct';
import ManageProduct from '../components/ManageProduct';
import ProductDetails from '../components/ProductDetails/ProductDetails';
// import { Modal } from './context/Modal';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/products/new",
        element: <CreateProduct />
      },
      {
        path: "/products/current",
        element: <ManageProduct />
      },
      {
        path: "/products/:productId",
        element: <ProductDetails />
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
    ],
  },
]);
