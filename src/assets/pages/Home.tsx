import {Tab, Tabs} from "@nextui-org/react";
import GeneralForm from "../components/GeneralForm.tsx";
import ClothingForm from "../components/ClothingForm.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import EyewearForm from "../components/EyewearForm.tsx";

export interface Department
{
    id: number,
    name: string,
}

export const departments: Department[] =
    [
        {id: 0, name: "No Dept."},
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

export default function Home()
{
    const navigate = useNavigate();
    const [tab, setTab] = useState<string>(useParams().tab ?? "general");

    useEffect(() =>
    {
        navigate(`/${tab}`);
    }, [tab]);

    return (
        <Tabs placement={"top"} className={"flex justify-center"} defaultSelectedKey={tab} onSelectionChange={value => setTab(value.toString() ?? tab)}>
            <Tab key={"general"} title={"General"}>
                <div className={"w-full h-[80vh]"}>
                    <GeneralForm/>
                </div>
            </Tab>
            <Tab key={"clothing"} title={"Clothing"}>
                <div className={"w-full h-[80vh]"}>
                    <ClothingForm/>
                </div>
            </Tab>
            <Tab key={"eyewear"} title={"Eyewear"}>
                <div className={"w-full h-[80vh]"}>
                    <EyewearForm/>
                </div>
            </Tab>
        </Tabs>
    );
}