<?php

use Slim\Factory\AppFactory;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";
$app = AppFactory::create();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->setBasePath("/api");
$app->get("/", function ($request, $response, $args)
{
    $params = $request->getQueryParams();
    $label = @$params["label"] ?? "";
    $department = @$params["department"] ?? "";
    $price = @$params["price"] ?? "";
    $mp = @$params["mp"] ?? "";
    $year = @$params["year"] ?? "";
    $color = @$params["color"] ?? "";
    $useClubPrice = isset($params["cp"]);
    $svg = isset($params["svg"]);

    $width = @$params["width"] ?? 1;
    $height = @$params["height"] ?? 0.75;
    $width -= .05;
    $height -= .05;
    $debug = isset($params["debug"]);
    $outline = $debug ? "outline: 1px solid red" : "";

    $retailLabel = $useClubPrice ? "Club Price" : "Retail Price";

    if ($department != "")
    {
        $department = "Dept: $department";
    }

    // calculate font-size multiplier based on width and height and number of characters in each line
    $priceTitleFontSizeModifier = 0;
    $priceFontSizeModifier = 0;
    $mpTitleFontSizeModifier = 0;
    $mpFontSizeModifier = 0;
    $mpTitleLineHeight = 0;
    $priceTitleLineHeight = 0;
    $yearFontSizeModifier = 0;
    $priceMargin = $price == "" && $mp != "" || $price != "" && $mp == "" ? "auto" : 0;


    if ($label != "")
    {
        $titleFontSizeModifier = $height / 9;

    }
    if ($price != "")
    {
        $price = number_format($price, 2);
        $priceTitleFontSizeModifier = $width / strlen($retailLabel) + .03;
        $priceFontSizeModifier = $width / strlen($price) + .01;
        $titleFontSizeModifier = $height / 7;
    }
    if ($mp != "")
    {
        $titleFontSizeModifier = $height / 7;
        $mpTitleFontSizeModifier = $height / 10;
        $mpFontSizeModifier = $height / 4.5;
        $mp = number_format($mp, 2);
        if ($price != "")
        {
            $priceTitleFontSizeModifier = $mpTitleFontSizeModifier;
            $priceFontSizeModifier = $height / 7;
            $titleFontSizeModifier = $height / 8;
        } else
        {
            $mpFontSizeModifier = $width / strlen($mp) + .01;
        }
    }

    if ($mp != "" && $price != "" && $label == "" && $department == "")
    {
        if ($year != "" || $color != "")
        {
            $mpFontSizeModifier = $width / strlen($mp) - .01;
            $priceFontSizeModifier = $width / strlen($price) - .07;
        } else
        {
            $priceFontSizeModifier = $width / strlen($price) - .03;
            $mpFontSizeModifier = $width / strlen($mp) + .01;
        }
    }

    if ($height <= .5)
    {
        $mpTitleLineHeight = 0;
        $priceTitleLineHeight = 0;
    }

    $departmentFontSizeModifier = 0;
    if ($department != "")
        $departmentFontSizeModifier = $height / 10;
    $yearFontSizeModifier = 0;
    if ($year != "" || $color != "")
    {
        $value = $year == "" ? $color : $year;
        $yearFontSizeModifier = ($width / 2) / strlen($value);
        $yearFontSizeModifier -= .3;
        if ($yearFontSizeModifier <= 0)
        {
            $yearFontSizeModifier = .08;
        }
    }

    if ($svg)
    {
        $svgContent = "<svg style='background-color:white;' width='{$width}in' height='{$height}in' xmlns='http://www.w3.org/2000/svg'>";
        $svgContent .= "<style>.outline { stroke: red; fill: none; }</style>";
        if ($outline)
        {
            $svgContent .= "<rect width='100%' height='100%' class='outline' />";
        }
        $yPos = 0.1; // Initial position

        if ($department != "")
        {
            $fontSize = $departmentFontSizeModifier * 72; // Convert inches to points
            $svgContent .= "<text x='5' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='start'>$department</text>";
            $yPos += $departmentFontSizeModifier; // Adjust position for next element
        }
        if ($label != "")
        {
            $fontSize = $titleFontSizeModifier * 72;
            $svgContent .= "<text x='50%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='middle'>$label</text>";
            $yPos += $titleFontSizeModifier;
        }
        if ($price != "")
        {
            if ($mp != "")
            {
                $fontSize = $priceTitleFontSizeModifier * 72;
                $svgContent .= "<text x='95%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='end'>$retailLabel</text>";
                $yPos += $priceTitleFontSizeModifier;
                if ($department != "" && $label != "")
                {
                    $yPos += $priceTitleFontSizeModifier - .05;
                } else if ($department != "" || $label != "")
                {
                    $yPos += $priceTitleFontSizeModifier - .05;
                } else
                {
                    $yPos += $priceTitleFontSizeModifier - .05;
                }
            } else
            {
                $yPos += .1;
            }
            $fontSize = $priceFontSizeModifier * 72;
            $svgContent .= "<text x='50%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='middle'>$$price</text>";
            $yPos += $priceFontSizeModifier - .03;
        }
        if ($mp != "")
        {
            if ($price != "")
            {
                $fontSize = $mpTitleFontSizeModifier * 72;
                $svgContent .= "<text x='95%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='end'>Marden's Price</text>";
                if ($department != "" || $label != "")
                {
                    $yPos += $mpTitleFontSizeModifier + .04;
                } else if ($department != "" || $label != "")
                {
                    $yPos += $mpTitleFontSizeModifier - .05;
                } else
                {
                    $yPos += $mpTitleFontSizeModifier + .1;
                }
            } else
            {
                $yPos += .1;
            }
            $fontSize = $mpFontSizeModifier * 72;
            $svgContent .= "<text x='50%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='middle'>$$mp</text>";
            $yPos += $mpFontSizeModifier - .05;
        }
        if ($year != "" || $color != "")
        {
            $fontSize = $yearFontSizeModifier * 72;
            $svgContent .= "<text x='5%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='start'>$color</text>";
            $svgContent .= "<text x='95%' y='{$yPos}in' font-family='Verdana' font-size='{$fontSize}px' font-weight='bold' text-anchor='end'>$year</text>";
        }
        $svgContent .= "</svg>";

        $response->getBody()->write($svgContent);
        return $response->withHeader("Content-Type", "image/svg+xml");
    } else
    {
        $response->getBody()->write("
    <body style='margin: .05in 0 0 .05in;font-size:5pt;'>
    <div style='font-family: verdana,sans-serif;width: {$width}in; height: {$height}in; text-align: center; margin: 0; {$outline}; position: relative;overflow:hidden;display: flex;flex-direction: column'>
    ");
        if ($department != "")
        {
            $response->getBody()->write("
        <div style='font-size: {$departmentFontSizeModifier}in; font-weight: Bold; padding-top: 0; padding-bottom: 0; padding-left: 0.05in; line-height: {$departmentFontSizeModifier}in; text-align: left;'>$department</div>
        ");
        }

        if ($label != "")
        {
            $response->getBody()->write("
        <div style='font-size: {$titleFontSizeModifier}in; line-height: {$titleFontSizeModifier}in; font-weight: Bold; text-align: center;'>$label</div>
        ");
        }

        if ($price != "")
        {
            $pStyle = "";
            $divStyle = "<div style='font-size: {$priceFontSizeModifier}in; font-weight: Bold; padding-bottom: 2px; line-height: {$priceFontSizeModifier}in;margin-block: auto;height: 100%;display: flex;justify-content: center;align-items: center;'>$$price</div>";

            if ($mp != "")
            {
                $pStyle = "<div style='font-size: {$priceTitleFontSizeModifier}in; font-weight: Bold; padding-left: 3px;line-height: {$priceTitleFontSizeModifier}in; text-align: right;'>$retailLabel</div>";
                $divStyle = "<div style='font-size: {$priceFontSizeModifier}in; font-weight: Bold; padding-bottom: 2px; line-height: {$priceFontSizeModifier}in;'>$$price</div>";
            }


            $response->getBody()->write($pStyle . $divStyle);
        }
        if ($mp != "")
        {
            $pStyleMp = "";
            $divStyleMp = "<div style='font-size: {$mpFontSizeModifier}in; font-weight: Bold; padding-left: 3px; padding-bottom: 2px; line-height: {$mpFontSizeModifier}in;height: 100%;display: flex;justify-content: center;align-items: center;'>$$mp</div>";

            if ($price != "")
            {
                $pStyleMp = "<div style='font-size: {$mpTitleFontSizeModifier}in; font-weight: Bold; padding-left: 3px;line-height: {$mpTitleFontSizeModifier}in; text-align: right;'>Marden's Price</div>";
                $divStyleMp = "<div style='font-size: {$mpFontSizeModifier}in; font-weight: Bold; padding-left: 3px; padding-bottom: 2px; line-height: {$mpFontSizeModifier}in;'>$$mp</div>";
            }


            $response->getBody()->write($pStyleMp . $divStyleMp);
        }

        if ($year != "" || $color != "")
        {
            $response->getBody()->write("
<div style='display: flex;align-items: center;padding-bottom: 5px; margin-inline: 5px'>
        <div  style='font-size: {$yearFontSizeModifier}in;text-wrap: nowrap;font-weight:bold'>$color</div>
        <div style='font-size: {$yearFontSizeModifier}in; font-weight: Bold; text-align: right;width: 100%;'>$year</div>
</div>
        ");
        }
        if (!$debug)
        {
            $response->getBody()->write("
    </div>
    <script>
      try
      {
          window.print();
      } catch (e)
      {
          console.error(e);
      }
      setTimeout(() => {
          window.close();
            }, 1000);
    </script>
    </body>
    ");
        }

        return $response->withHeader("Content-Type", "text/html");
    }
});


$app->run();