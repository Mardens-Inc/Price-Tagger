import {Button, Card, CardBody, CardFooter, CardHeader, Input, Tooltip} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPrint} from "@fortawesome/free-solid-svg-icons";

export default function EyewearForm()
{
    const [mardensPrice, setMardensPrice] = useState<string>("");
    const [printHTML, setPrintHTML] = useState<string>("");

    useEffect(() =>
    {
        const html =
            `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <title>Print</title>
</head>
<body style="font-family: verdana,sans-serif; font-size: 5pt; margin: 0;background-color:white;">
<div id="eyewearbox" style="width: 110px; height: 78px; text-align: center; margin-left: 7px; margin-top: 0; font-family: 'Roboto', sans-serif;">
    <div class="rotate180" style="transform: rotate(180deg); padding-bottom: 5px;">
        <p class="LotNum" style="font-size: 8pt; font-weight: Bold; padding-left: 3px; padding-bottom: -5px; line-height: 6px; text-align: right;">Marden's Price</p>
        <div class="MP" style="font-size: 13pt; font-weight: Bold; line-height: 2px;">$${mardensPrice}</div>
    </div>
    <div class="bottom" style="margin-top: 27px;">
        <p class="LotNum" style="font-size: 8pt; font-weight: Bold; padding-left: 3px; padding-bottom: -5px; line-height: 6px; text-align: right;">Marden's Price</p>
        <div class="MP" style="font-size: 13pt; font-weight: Bold; line-height: 2px;">$${mardensPrice}</div>
    </div>
</div>
</body>
</html>

        `;
        const s = document.getElementById("preview-frame") as HTMLIFrameElement;
        s.srcdoc = html;
        s.contentDocument?.close();
        setPrintHTML(html);
    }, [mardensPrice]);

    const print = () =>
    {
        const printWindow = window.open("", "_blank", "toolbar=no,scrollbars=no,resizable=no,width=1020,height=667");
        printWindow?.document.write(printHTML);
        printWindow?.print();
        printWindow?.close();
    };


    return (
        <Card classNames={{
            base: "dark:text-white w-[90%] mx-auto  max-h-[calc(100vh_-_100px)] h-[100vh] overflow-y-auto",
            body: "pb-4",
            footer: "py-4 min-h-[300px]"
        }}>
            <CardHeader>
                <p className={"text-4xl"}> Eyewear Tags </p>
                <div className={"ml-auto"}>
                    <Tooltip content={"Print"}>
                        <Button color={"primary"} radius={"full"} className={"min-w-0 h-14 w-14"} onClick={print}><FontAwesomeIcon icon={faPrint}/></Button>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardBody className={"flex flex-col gap-4"}>
                <Input
                    label={"Mardens Price"}
                    value={mardensPrice}
                    onValueChange={value =>
                    {
                        value = value.replace(/[^0-9.]/g, "");
                        setMardensPrice(value.toString());
                    }}
                />
            </CardBody>
            <CardFooter>
                <div className="flex flex-row items-center">
                    <div id="preview" className={"flex flex-col"}>
                        <div className={"mb-[6rem]"}>
                            <p className={"text-2xl"}>Preview:</p>
                            <i><strong>Note:</strong> This is not an exact representation of what the output will be.</i>
                        </div>
                        <iframe id={"preview-frame"} className={"outline outline-primary outline-1 w-[1.25in] h-[1in] scale-[2] translate-x-[4rem] translate-y-[-2rem] cursor-pointer rounded-lg overflow-hidden"}>
                        </iframe>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
