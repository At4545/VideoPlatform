
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './redux/store.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store.jsx';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import {Home, Login,SignUp,Dashboard,VIdeoPlayerComponent} from "./Components/index.js"


  const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
        {
            path:"/",
            element:<Home/>
        },
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/register",
            element:<SignUp/>
        },
        {
            path:"/:id",
            element:<VIdeoPlayerComponent/>
        },
        {
            path:"/you",
            element:<Dashboard/>
        },
    ]
  },
  {
    path:"/*",
    element:<h1>pagenotfound</h1>
  },
  
  
],
);
createRoot(document.getElementById('root')).render(
  
   <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate> 
   </Provider>
)
