import {Button, Card, CardBody, CardFooter, CardHeader, DatePicker, Input, Tooltip} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPrint} from "@fortawesome/free-solid-svg-icons";
import {DateValue, getLocalTimeZone, today} from "@internationalized/date";

export default function ClothingForm()
{
    const [code, setCode] = useState<string>("");
    const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [printHTML, setPrintHTML] = useState<string>("");

    useEffect(() =>
    {
        if (!date) return;
        const html =
            `
<html lang="en">
<head>
    <title>Print</title>
</head>
<body style="display: flex; flex-direction: column;  flex-wrap: nowrap;justify-content: center;align-items: center;width: 1in; height: .75in;font-family: Lato, sans-serif;overflow: hidden; margin-top:0; margin-left: .05in">
        <p style="margin: 0;font-size: 2rem;text-transform: uppercase;font-weight: bold;">${code}</p>
        <p style="margin: 0;font-size: .8rem;">Ship Date:</p>
        <p style="margin: 0;font-size: .8rem;">${date.month}/${date.day}/${date.year}</p>
    </body>
</html>
        `;
        const s = document.getElementById("preview-frame") as HTMLIFrameElement;
        s.srcdoc = html;
        s.contentDocument?.close();
        setPrintHTML(html);
    }, [code, date]);

    const print = () =>
    {
        const printWindow = window.open("", "_blank", "toolbar=no,scrollbars=no,resizable=no,width=1020,height=667");
        printWindow?.document.write(printHTML);
        printWindow?.print();
        printWindow?.close();
    };


    return (
        <Card classNames={{
            base: "dark:text-white w-[90%] mx-auto max-h-[calc(100vh_-_100px)] h-[100vh] overflow-y-auto",
            body: "pb-4",
            footer: "py-4 min-h-[300px]"
        }}>
            <CardHeader>
                <p className={"text-4xl"}> Clothing Tags </p>
                <div className={"ml-auto"}>
                    <Tooltip content={"Print"}>
                        <Button color={"primary"} radius={"full"} className={"min-w-0 h-14 w-14"} onClick={print}><FontAwesomeIcon icon={faPrint}/></Button>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardBody className={"flex flex-col gap-4"}>
                <Input
                    label={"Code"}
                    placeholder={"VH4"}
                    value={code}
                    maxLength={3}
                    onValueChange={value => setCode(value.toString().toUpperCase())}
                />
                <DatePicker
                    label={"Ship Date"}
                    minValue={today(getLocalTimeZone())}
                    defaultValue={today(getLocalTimeZone())}
                    onChange={value => setDate(value ?? today(getLocalTimeZone()))}
                    showMonthAndYearPickers
                />
            </CardBody>
            <CardFooter>
                <div className="flex flex-row items-center">
                    <div id="preview" className={"flex flex-col"}>
                        <div className={"mb-4"}>
                            <p className={"text-2xl"}>Preview:</p>
                            <i><strong>Note:</strong> This is not an exact representation of what the output will be.</i>
                        </div>
                        <iframe id={"preview-frame"} className={"outline outline-primary outline-1 w-[1in] h-[0.75in] scale-[2] translate-x-[3rem] translate-y-[2rem] cursor-pointer rounded-lg overflow-hidden"}>
                        </iframe>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
