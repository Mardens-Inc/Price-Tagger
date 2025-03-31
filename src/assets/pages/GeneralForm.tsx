import {Autocomplete, AutocompleteItem, Button, Card, CardBody, CardHeader, Image, Input, Tooltip} from "@heroui/react";
import {useEffect, useState} from "react";
import {departments} from "../../main.tsx";
import {Icon} from "@iconify-icon/react";

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
    const [showPriceLabel, setShowPriceLabel] = useState<boolean>(false);
    const [usePercentage, setUsePercentage] = useState<boolean>(false);
    const [percentage, setPercentage] = useState<string>("");
    const [printUrl, setPrintUrl] = useState<URL>(new URL(`https://pricing-new.mardens.com/api/tag-pricer/general?svg`));

    useEffect(() =>
    {
        // const uri: URL = new URL("http://pricing.local/api/tag-pricer/general");
        const uri: URL = new URL("https://pricetagger.mardens.com/api/");
        if (department) uri.searchParams.append("department", department);
        if (label) uri.searchParams.append("label", label);
        if (color) uri.searchParams.append("color", color);
        if (retailPrice) uri.searchParams.append("price", retailPrice);
        if (mardensPrice) uri.searchParams.append("mp", mardensPrice);
        if (year) uri.searchParams.append("year", year);
        if (useClubPrice) uri.searchParams.append("cp", "");
        if (showPriceLabel) uri.searchParams.append("showPriceLabel", "");
        if (stickerSize)
        {
            const [width, height] = stickerSize.split("x");
            uri.searchParams.append("width", width);
            uri.searchParams.append("height", height);
        }
        uri.searchParams.append("svg", "");
        uri.searchParams.append("v", Date.now().toString());

        setPrintUrl(uri);
    }, [department, label, color, retailPrice, mardensPrice, year, stickerSize, useClubPrice, usePercentage, showPriceLabel]);

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
                    <Tooltip content={"Show will show the \"Marden's Price\" and \"Retail Price\" over the fields"}>
                        <Button radius={"full"} color={showPriceLabel ? "primary" : "default"} onPress={() => setShowPriceLabel(prev => !prev)}>
                            <Icon icon="mage:tag-2-fill"/>
                        </Button>
                    </Tooltip>
                    <Tooltip content={"Replace the \"Retail Price\" with \"Club Price\". This is used for Sam's Club tags."}>
                        <Button radius={"full"} color={useClubPrice ? "primary" : "default"} onPress={() => setUseClubPrice(prev => !prev)}>
                            {useClubPrice ? <Icon icon="fa6-solid:store"/> : <Icon icon="fa6-solid:store-slash"/>}
                        </Button>
                    </Tooltip>
                    <Tooltip content={"Calculate the Mardens Price using a percentage instead of a static value."}>
                        <Button radius={"full"} color={usePercentage ? "primary" : "default"} onPress={() => setUsePercentage(prev => !prev)}>
                            <Icon icon="fa6-solid:percent"/>
                        </Button>
                    </Tooltip>

                </div>
                <div className={"ml-auto"}>
                    <Tooltip content={"Print"}>
                        <Button color={"primary"} radius={"full"} className={"min-w-0 h-14 w-14"} onPress={print}><Icon icon="mage:printer-fill"/></Button>
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
                            {[
                                "Catalog Site Price",
                                "Internet Site Price",
                                "Office Store",
                                "Big Box Price",
                                "Drug Store Price",
                                "Book Store Price",
                                "Holiday Stock",
                                "Supply Store Price",
                                "Rug Store Price",
                                "Garden Center Price",
                                "Club Price",
                                "Gift Shop Price",
                                "Sporting Goods Store",
                                "Mardens Price",
                                "Retail Price",
                                "Pet Shop Retail",
                                "Dept Store Retail"
                            ].map((label) => (
                                <AutocompleteItem key={label} value={label}>
                                    {label}
                                </AutocompleteItem>
                            )) as any}
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
                                                            {id: ".4", name: "60% Off Retail"},
                                                            {id: ".3", name: "70% Off Retail"},
                                                            {id: ".2", name: "80% Off Retail"},
                                                            {id: ".1", name: "90% Off Retail"}
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
                                    {[
                                        "White",
                                        "Peach",
                                        "Rose",
                                        "Light-Purple",
                                        "Purple",
                                        "Dark-Purple",
                                        "Light-Blue",
                                        "Blue",
                                        "Dark-Blue",
                                        "Aqua",
                                        "Brown",
                                        "Dark-Brown",
                                        "Mint",
                                        "Green",
                                        "Dark-Green",
                                        "Yellow",
                                        "Dark-Yellow",
                                        "Light-Pink",
                                        "Pink",
                                        "Dark-Gray",
                                        "Teal",
                                        "Gray"
                                    ].map((color) => (
                                        <AutocompleteItem key={color} value={color}>
                                            {color.replace(/-/g, " ")}
                                        </AutocompleteItem>
                                    )) as any}
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
