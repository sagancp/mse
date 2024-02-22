import { BarChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
    // { field: "id", headerName: "№", width: 70 },
    { field: "ticker", headerName: "Хувьцаа", width: 120 },
    { field: "company_name", headerName: "Компанийн нэр", width: 240 },
    { field: "industry", headerName: "Үйл ажиллагааны чиглэл", width: 200, align:"center" },
    { field: "price", headerName: "Хувьцааны үнэ /MNT/", width: 180, align:"right" },
    {
        field: "market_cap",
        
        headerName: "Зах зээлийн үнэлгээ /mln MNT/",
        width: 240,
        align:"right"
    },
    { field: "trailing_pe_2023_4Q", headerName: "PE харьцаа", width: 130, align:"center" },
    { field: "pb_2023_4Q", headerName: "PB харьцаа", width: 130, align:"center" },
    { field: "roe_2023_4Q", headerName: "ROE харьцаа", width: 130, align:"center" },
    { field: "roa_2023_4Q", headerName: "ROA харьцаа", width: 130, align:"center" },
    //   {
    //     field: 'age',
    //     headerName: 'Age',
    //     type: 'number',
    //     width: 90,
    //   },
    //   {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params: GridValueGetterParams) =>
    //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    //   },
];

export async function getGoogleSheetsData(range: string) {
    const apiKey = "AIzaSyAPYf2hp4fgLj5fXbY6G8w00m1_qgxoqNE";
    const spreadsheetId = "1_NM0doJX5qSx0Hp9RbUlCx4uX22IlTmUP5iWw2NGpc4";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error("Error fetching Google Sheets data:", error);
        return null;
    }
}

export default function Home() {
    const [data, setData] = useState<any>(null);

    const numberFormatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    useEffect(() => {
        getGoogleSheetsData("process_data!A1:z99").then((res) => {
            const keys = res.shift(); // Remove and store keys

            const result = res.map((entry: any) => {
                const obj: any = {};
                keys.forEach((key: any, index: number) => {
                    if (
                        [
                            "trailing_pe_2023_4Q",
                          
                        ].includes(key)
                    ) {
                        
                        obj[key] = parseFloat(entry[index]) // Parse to float
                    }  else {
                        obj[key] = entry[index];
                    }
                });
                return obj;
            });
            // "roe_2023_4Q","roa_2023_4Q"
            // ,parseFloat(str.replaceAll(',', ''));
            console.log(result);
            let processed: any[] = [];
            result?.map((e: any) => {
                if (
                    ![NaN].includes(e?.trailing_pe_2023_4Q) 
                ) {
                    processed.push(e);
                    console.log(e.no);
                }

                processed.sort((b, a) => {
                    return a.trailing_pe_2023_4Q - b.trailing_pe_2023_4Q;
                });

                setData(processed);
            });
        });
    }, []);
    console.log(data);

    return (
        <main className="container m-auto">
            <h1 className="text-center font-sans text-2xl font-bold mt-5">
                PE ratios
            </h1>
            {/* <div className="flex flex-wrap grid-cols-1">
                {data?.map((v: any, i: number) => (
                    <div
                        className={`flex justify-between  w-40  p-5 m-3 rounded ${
                            v.trailing_pe_2024_4Q > 15
                                ? "bg-red-300"
                                : "bg-green-300"
                        }`}
                        key={i}>
                       
                        <h4 className="text-xs align-middle">{v.ticker}</h4>
                        <span className="mr-2 font-bold text-white">
                            {v.price}
                        </span>
                        <span className="text-white">
                            {v.trailing_pe_2024_4Q}
                        </span>
                    </div>
                ))}
            </div>

            {data && (
                <div className="flex justify-center">
                    <BarChart
                        xAxis={[
                            {
                                id: "barCategories",
                                data: data?.map((e: any) => e.ticker),
                                scaleType: "band",
                            },
                        ]}
                        series={[
                            {
                                data: data?.map(
                                    (e: any) => e.trailing_pe_2024_4Q
                                ),
                            },
                        ]}
                        width={1000}
                        height={300}
                    />
                </div>
            )} */}
            {data && (
                <div style={{ height: 800, width: "100%" }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 40 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </div>
            )}
        </main>
    );
}
