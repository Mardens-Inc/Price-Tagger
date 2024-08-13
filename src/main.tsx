import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import Home from "./assets/pages/Home.tsx";
import {applyTheme} from "./assets/components/ThemeSwitcher.tsx";
import Navigation from "./assets/components/Navigation.tsx";

applyTheme();

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    const navigate = useNavigate();
    return (
        <NextUIProvider navigate={navigate}>
            <Navigation/>
            <Routes>
                <Route>
                    <Route path="/:tab?" element={<Home/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

