import {NavbarMenuToggle, Tab, Tabs} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher from "./ThemeSwitcher.tsx";
import {useLocation} from "react-router-dom";

export default function Navigation()
{
    const {pathname} = useLocation();

    return (
        <Navbar>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden"/>
                <NavbarBrand>
                    <p className="font-bold text-inherit">*NEW* Price Tagger</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <Tabs defaultSelectedKey={pathname} selectedKey={pathname}>
                    <Tab href={"/"} key={"/"} title={"General"}/>
                    <Tab href={"/clothing"} key={"/clothing"} title={"Clothing"}/>
                    <Tab href={"/eyewear"} key={"/eyewear"} title={"Eyewear"}/>
                </Tabs>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
