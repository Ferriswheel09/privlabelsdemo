import React from "react";

import type {
    LinksFunction,
    LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Input } from "@nextui-org/react";
import {
    Form,
    //Link,
    Links,
    LiveReload,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useNavigation,
    useSubmit,
} from "@remix-run/react";

import { LoremIpsum } from "react-lorem-ipsum";
import { loremIpsum } from 'react-lorem-ipsum';
import { name, surname, username } from 'react-lorem-ipsum';


import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Button,
    Divider
} from "@nextui-org/react";


interface Run{
    key: string;
    label: string;
}

interface AppId{
    app_name: string;
    app_id:string; 
}

interface ExplorerSidebarProps {
    q: string | null; // the query string
    runs: Run[]; //the dropdown information
    searching: boolean | undefined; //waiting for db data or not?
    app_list: AppId[] | undefined; //list of {appname,appid} list to render following a search
  }



export default function ExploreSidebar(props: ExplorerSidebarProps){
    const q = props.q;
    const runs = props.runs;
    const searching = props.searching;
    const app_list = props.AppId;
    
    const init_label = runs[0]["label"] ? runs[0].label: "None";


    const [selectedKeys, setSelectedKeys] = React.useState(new Set([init_label]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

   
    
    return (
        <div id="explore-sidebar" className="w-1/5 items-stretch h-screen overflow-y-auto dark:divide-white divide-black ">
            <h2 className="text-center underline">iOS Apps</h2>
            <div id="search-region" className="mt-2">
                <Form id="search-form"
                    // onChange={(event) => {
                    //     const isFirstSearch = q === null;
                    //     submit(event.currentTarget, {
                    //         replace: !isFirstSearch,
                    //     });
                    // }}
                    role="search">
                    <div className="w-full flex flex-row flex-wrap gap-4">
                        <Input
                            key="lg"
                            radius="lg"
                            name="q"
                            type="serach"
                            //label="Search"
                            placeholder="Search for app by name"
                            defaultValue={q || ""}
                            className="max-w-1/5 m-2"
                        />
                    </div>
                    <div
                        id="search-spinner"
                        aria-hidden
                        hidden={!searching}
                    />
                    <div className="flex flex-wrap w-full">
                        <div className="m-2">
                            <Button
                                variant="bordered"
                            >
                                Search
                            </Button>
                        </div>
                        <div className="m-2">
                            <Dropdown backdrop="blur">
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        className="capitalize"
                                    >
                                        {selectedValue}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Select Runs"
                                    variant="flat"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={setSelectedKeys}
                                    items={runs}
                                >
                                    {(item) => (
                                        <DropdownItem
                                            key={item.key}
                                            color="default"
                                            className=""
                                        >
                                            {item.label}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                    </div>
                </Form>
            </div>
            <div id="search-results-region" className="mt-2">
                <ul className="my-2">
                    {(() => {
                        const arr = [];
                        for (let i = 0; i < 40; i++) {
                            arr.push(
                                <li className="my-2 ml-2">{name()} {surname()}</li>
                            );
                        }
                        return arr;
                    })()}
                </ul>
            </div>
        </div >

    );
}
