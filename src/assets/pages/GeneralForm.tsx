import {Autocomplete, AutocompleteItem, Button, Card, CardBody, CardHeader, cn, Image, Input, Switch, Tooltip} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPrint} from "@fortawesome/free-solid-svg-icons";
import {departments} from "../../main.tsx";

export default function GeneralForm()
{
    const [department, setDepartment] = useState<string | null>(null);
    const [label, setLabel] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [retailPrice, setRetailPrice] = useState<string | null>(null);
    const [mardensPrice, setMardensPrice] = useState<string | null>(null);
    const [year, setYear] = useState<string | null>(null);
    const [stickerSize, setStickerSize] = useState<string>("1x.75");
    const [useClubPrice, setUseClubPrice] = useState<boolean>(false);
    const [usePercentage, setUsePercentage] = useState<boolean>(false);
    const [percentage, setPercentage] = useState<string>("");
    const [printUrl, setPrintUrl] = useState<URL>(new URL(`https://pricing-new.mardens.com/api/tag-pricer/general?svg`));

    useEffect(() =>
    {
        // const uri: URL = new URL("http://pricing.local/api/tag-pricer/general");
        const uri: URL = new URL("https://pricing-new.mardens.com/api/tag-pricer/general");
        if (department) uri.searchParams.append("department", department);
        if (label) uri.searchParams.append("label", label);
        if (color) uri.searchParams.append("color", color);
        if (retailPrice) uri.searchParams.append("price", retailPrice);
        if (mardensPrice) uri.searchParams.append("mp", mardensPrice);
        if (year) uri.searchParams.append("year", year);
        if (useClubPrice) uri.searchParams.append("cp", "");
        if (stickerSize)
        {
            const [width, height] = stickerSize.split("x");
            uri.searchParams.append("width", width);
            uri.searchParams.append("height", height);
        }
        uri.searchParams.append("svg", "");
        uri.searchParams.append("v", Date.now().toString());

        setPrintUrl(uri);
    }, [department, label, color, retailPrice, mardensPrice, year, stickerSize, useClubPrice, usePercentage]);

    const print = () =>
    {
        printUrl.searchParams.delete("svg");
        window.open(printUrl.toString(), "_blank", "toolbar=no,scrollbars=no,resizable=no,width=1020,height=667");
    };
    const calculateMP = (percentage: string) =>
    {
        if (retailPrice && percentage)
        {
            setPercentage(percentage);
            const price = parseFloat(retailPrice);
            const mp = price * parseFloat(percentage);
            setMardensPrice(mp.toFixed(2));
        }
    };


    return (
        <Card classNames={{
            base: "dark:text-white w-[90%] mx-auto max-h-[calc(100vh_-_100px)] h-[100vh] overflow-y-auto",
            body: "pb-4",
            footer: "py-4 min-h-[300px]"
        }}>
            <CardHeader>
                <p className={"text-4xl mr-auto"}> General Tags </p>

                <div className="flex flex-row gap-4">
                    <Switch
                        checked={useClubPrice}
                        onValueChange={setUseClubPrice}
                        classNames={{
                            base: cn(
                                "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                                "data-[selected=true]:border-primary"
                            ),
                            wrapper: "p-0 h-4 overflow-visible",
                            thumb: cn("w-6 h-6 border-2 shadow-lg",
                                "group-data-[hover=true]:border-primary",
                                //selected
                                "group-data-[selected=true]:ml-6",
                                // pressed
                                "group-data-[pressed=true]:w-7",
                                "group-data-[selected]:group-data-[pressed]:ml-4"
                            )
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-medium">Use Club Price</p>
                            <p className="text-tiny text-default-400">
                                Replace the "Retail Price" with "Club Price".<br/> This is used for Sam's Club tags.
                            </p>
                        </div>
                    </Switch>
                    <Switch
                        checked={usePercentage}
                        onValueChange={setUsePercentage}
                        classNames={{
                            base: cn(
                                "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                                "data-[selected=true]:border-primary"
                            ),
                            wrapper: "p-0 h-4 overflow-visible",
                            thumb: cn("w-6 h-6 border-2 shadow-lg",
                                "group-data-[hover=true]:border-primary",
                                //selected
                                "group-data-[selected=true]:ml-6",
                                // pressed
                                "group-data-[pressed=true]:w-7",
                                "group-data-[selected]:group-data-[pressed]:ml-4"
                            )
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-medium">Use Percentage</p>
                            <p className="text-tiny text-default-400">
                                Calculate the Mardens Price using a percentage instead of a static value.
                            </p>
                        </div>
                    </Switch>
                </div>
                <div className={"ml-auto"}>
                    <Tooltip content={"Print"}>
                        <Button color={"primary"} radius={"full"} className={"min-w-0 h-14 w-14"} onClick={print}><FontAwesomeIcon icon={faPrint}/></Button>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardBody>
                <p className={"italic mb-4"}>Leave any fields blank that are not required</p>
                <div className="flex flex-col gap-2">
                    <p className={"text-xl"}>Top:</p>
                    <div className="flex flex-row gap-4">
                        <Autocomplete
                            size={"sm"}
                            label={"Department"}
                            value={department ?? "0"}
                            onValueChange={setDepartment}
                            onSelectionChange={value => setDepartment(value?.toString() ?? "")}
                            defaultItems={departments}
                        >
                            {department =>
                            {
                                return <AutocompleteItem key={department.id} value={department.id} textValue={department.name}>{department.id} - {department.name}</AutocompleteItem>;
                            }}
                        </Autocomplete>
                        <Autocomplete
                            size={"sm"}
                            label={"Label"}
                            id="label"
                            name="label"
                            value={label ?? ""}
                            onValueChange={setLabel}
                            onSelectionChange={value => setLabel(value?.toString() ?? "")}
                        >
                            <AutocompleteItem key="" value="">No Label</AutocompleteItem>
                            <AutocompleteItem key="Catalog Site Price" value="Catalog Site Price">Catalog Site Price</AutocompleteItem>
                            <AutocompleteItem key="Internet Site Price" value="Internet Site Price">Internet Site Price</AutocompleteItem>
                            <AutocompleteItem key="Office Store" value="Office Store">Office Store</AutocompleteItem>
                            <AutocompleteItem key="Big Box Price" value="Big Box Price">Big Box Price</AutocompleteItem>
                            <AutocompleteItem key="Drug Store Price" value="Drug Store Price">Drug Store Price</AutocompleteItem>
                            <AutocompleteItem key="Book Store Price" value="Book Store Price">Book Store Price</AutocompleteItem>
                            <AutocompleteItem key="Holiday Stock" value="Holiday Stock">Holiday Stock</AutocompleteItem>
                            <AutocompleteItem key="Supply Store Price" value="Supply Store Price">Supply Store Price</AutocompleteItem>
                            <AutocompleteItem key="Rug Store Price" value="Rug Store Price">Rug Store Price</AutocompleteItem>
                            <AutocompleteItem key="Garden Center Price" value="Garden Center Price">Garden Center Price</AutocompleteItem>
                            <AutocompleteItem key="Club Price" value="Club Price">Club Price</AutocompleteItem>
                            <AutocompleteItem key="Gift Shop Price" value="Gift Shop Price">Gift Shop Price</AutocompleteItem>
                            <AutocompleteItem key="Sporting Goods Store" value="Sporting Goods Store">Sporting Goods Store</AutocompleteItem>
                            <AutocompleteItem key="Mardens Price" value="Mardens Price">Mardens Price</AutocompleteItem>
                            <AutocompleteItem key="Retail Price" value="Retail Price">Retail Price</AutocompleteItem>
                        </Autocomplete>
                    </div>
                    <div className={"flex flex-row"}>
                        <div className={"flex flex-col w-full mr-8 gap-4"}>
                            <p className={"text-xl"}>Content:</p>
                            <div className="flex flex-row gap-4">
                                <Input
                                    size={"sm"}
                                    label={useClubPrice ? "Club Price" : "Retail Price"}
                                    type={"text"}
                                    min={0}
                                    step={0.01}
                                    value={retailPrice ?? ""}
                                    onValueChange={(value) =>
                                    {
                                        value = value.replace(/[^0-9.]/g, "");
                                        setRetailPrice(value == "" ? null : value);
                                        if (usePercentage) calculateMP(percentage);
                                    }}
                                />
                                {
                                    (
                                        () =>
                                        {
                                            if (usePercentage)
                                            {
                                                return (
                                                    <Autocomplete
                                                        size={"sm"}
                                                        label="Percentage Off"
                                                        onSelectionChange={value => calculateMP(value?.toString() ?? "")}
                                                        onValueChange={calculateMP}
                                                        defaultItems={[
                                                            {id: ".7", name: "30% Off Retail"},
                                                            {id: ".67", name: "33% Off Retail"},
                                                            {id: ".65", name: "35% Off Retail"},
                                                            {id: ".6", name: "40% Off Retail"},
                                                            {id: ".5", name: "50% Off Retail"},
                                                            {id: ".4", name: "60% Off Retail"}
                                                        ]}
                                                    >
                                                        {item => <AutocompleteItem key={item.id} value={item.id}>{item.name}</AutocompleteItem>}
                                                    </Autocomplete>
                                                );
                                            } else
                                            {
                                                return (
                                                    <Input
                                                        size={"sm"}
                                                        label={"Mardens Price"}
                                                        type="text"
                                                        min={0}
                                                        step={0.01}
                                                        value={mardensPrice ?? ""}
                                                        onValueChange={(value) =>
                                                        {
                                                            value = value.replace(/[^0-9.]/g, "");
                                                            setMardensPrice(value == "" ? null : value);
                                                        }}
                                                    />
                                                );
                                            }
                                        })()
                                }
                            </div>

                            <p className={"text-xl"}>Footer:</p>
                            <div className="flex flex-row gap-4">
                                <Autocomplete
                                    size={"sm"}
                                    label={"Color"}
                                    id="color-selector"
                                    name="color-selector"
                                    value={color ?? ""}
                                    onValueChange={setColor}
                                    onSelectionChange={value => setColor(value?.toString() ?? "")}
                                >
                                    <AutocompleteItem key="" value="">No Color</AutocompleteItem>
                                    <AutocompleteItem key="Peach" value="Peach">Peach</AutocompleteItem>
                                    <AutocompleteItem key="Rose" value="Rose">Rose</AutocompleteItem>
                                    <AutocompleteItem key="Light-Purple" value="Light-Purple">Light Purple</AutocompleteItem>
                                    <AutocompleteItem key="Purple" value="Purple">Purple</AutocompleteItem>
                                    <AutocompleteItem key="Dark-Purple" value="Dark-Purple">Dark Purple</AutocompleteItem>
                                    <AutocompleteItem key="Light-Blue" value="Light-Blue">Light Blue</AutocompleteItem>
                                    <AutocompleteItem key="Blue" value="Blue">Blue</AutocompleteItem>
                                    <AutocompleteItem key="Dark-Blue" value="Dark-Blue">Dark Blue</AutocompleteItem>
                                    <AutocompleteItem key="Aqua" value="Aqua">Aqua</AutocompleteItem>
                                    <AutocompleteItem key="Brown" value="Brown">Brown</AutocompleteItem>
                                    <AutocompleteItem key="Dark-Brown" value="Dark-Brown">Dark Brown</AutocompleteItem>
                                    <AutocompleteItem key="Mint" value="Mint">Mint</AutocompleteItem>
                                    <AutocompleteItem key="Green" value="Green">Green</AutocompleteItem>
                                    <AutocompleteItem key="Dark-Green" value="Dark-Green">Dark Green</AutocompleteItem>
                                    <AutocompleteItem key="Yellow" value="Yellow">Yellow</AutocompleteItem>
                                    <AutocompleteItem key="Dark-Yellow" value="Dark-Yellow">Dark Yellow</AutocompleteItem>
                                    <AutocompleteItem key="Light-Pink" value="Light-Pink">Light Pink</AutocompleteItem>
                                    <AutocompleteItem key="Pink" value="Pink">Pink</AutocompleteItem>
                                    <AutocompleteItem key="Dark-Gray" value="Dark-Gray">Dark Gray</AutocompleteItem>
                                    <AutocompleteItem key="Teal" value="Teal">Teal</AutocompleteItem>
                                    <AutocompleteItem key="Gray" value="Gray">Gray</AutocompleteItem>
                                </Autocomplete>
                                <Input
                                    size={"sm"}
                                    label={"Year"}
                                    type="text"
                                    min={0}
                                    step={1}
                                    maxLength={2}
                                    value={year ?? ""}
                                    onValueChange={(value) =>
                                    {
                                        value = value.replace(/[^0-9]/g, "");
                                        setYear(value == "" ? null : value);
                                    }}
                                />
                            </div>
                            <p className={"text-xl"}>Sticker:</p>
                            <div className="flex flex-row gap-4">
                                <Autocomplete
                                    size={"sm"}
                                    label={"Sticker Size"}
                                    id="sticker-size"
                                    name="sticker-size"
                                    value={stickerSize}
                                    defaultSelectedKey={stickerSize}
                                    onValueChange={setStickerSize}
                                    onSelectionChange={value => setStickerSize(value?.toString() ?? "")}
                                >
                                    <AutocompleteItem key="1x.75" value="1x.75">Colored (1in x 0.75in)</AutocompleteItem>
                                    <AutocompleteItem key=".8x.5" value=".8x.5">Orange (0.8in x 0.5in)</AutocompleteItem>
                                    <AutocompleteItem key="1.25x1" value="1.25x1">Large (1.25in x 1in)</AutocompleteItem>
                                </Autocomplete>
                            </div>
                        </div>
                        <div className="flex flex-row items-center rounded-md max-w-[250px]">
                            <div id="preview" className={"flex flex-col"}>
                                <div className={"mb-4"}>
                                    <p className={"text-2xl"}>Preview:</p>
                                    <i><strong>Note:</strong> This is not an exact representation of what the output will be.</i>
                                </div>
                                <Image
                                    onClick={print}
                                    width={250}
                                    className={"outline outline-primary outline-2"}
                                    src={printUrl.toString()}
                                    loading={"lazy"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
