import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, Outlet , createBrowserRouter} from 'react-router-dom';
import Header from './components/Header';
import VideoSearch from './components/VideoSearch';

const root = ReactDOM.createRoot(document.getElementById("root"));

const AppLayout = () => {
    return (
        <div className="app">
            <Header />
            <Outlet />
        </div>
    )
}



const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <VideoSearch />
            }
        ]
    }
])

root.render(
    <RouterProvider router={appRouter} />
)