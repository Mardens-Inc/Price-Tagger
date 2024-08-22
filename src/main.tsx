import React from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import ReactDOM from "react-dom/client";
import $ from "jquery";
import {NextUIProvider} from "@nextui-org/react";

import "./assets/scss/index.scss";
import {applyTheme} from "./assets/components/ThemeSwitcher.tsx";
import Navigation from "./assets/components/Navigation.tsx";
import GeneralForm from "./assets/pages/GeneralForm.tsx";
import ClothingForm from "./assets/pages/ClothingForm.tsx";
import EyewearForm from "./assets/pages/EyewearForm.tsx";

export interface Department
{
    id: number,
    name: string,
}

export const departments: Department[] =
    [
        {id: 1, name: "General"},
        {id: 2, name: "Clothing"},
        {id: 3, name: "Furniture"},
        {id: 4, name: "Grocery Taxable"},
        {id: 5, name: "Shoes"},
        {id: 6, name: "Fabric"},
        {id: 7, name: "Flooring/Carpet"},
        {id: 8, name: "Hardware"},
        {id: 9, name: "Special Sales"},
        {id: 14, name: "Grocery Non-Taxable"}
    ];

ReactDOM.createRoot($("#root")[0]!).render(
    <React.StrictMode>
        <BrowserRouter>
            <PageContent/>
        </BrowserRouter>
    </React.StrictMode>
);


function PageContent()
{
    applyTheme();
    const navigate = useNavigate();
    return (
        <NextUIProvider navigate={navigate}>
            <Navigation/>
            <Routes>
                <Route>
                    <Route path="/" element={<GeneralForm/>}/>
                    <Route path="/clothing" element={<ClothingForm/>}/>
                    <Route path="/eyewear" element={<EyewearForm/>}/>
                </Route>
            </Routes>
        </NextUIProvider>
    );
}

