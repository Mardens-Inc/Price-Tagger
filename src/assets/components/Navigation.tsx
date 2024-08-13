import {NavbarMenuToggle} from "@nextui-org/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import ThemeSwitcher from "./ThemeSwitcher.tsx";

export default function Navigation()
{

    return (
        <Navbar>
            <NavbarContent>
                <NavbarMenuToggle className="sm:hidden"/>
                <NavbarBrand>
                    <p className="font-bold text-inherit">*NEW* Price Tagger</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">

            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitcher/>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
