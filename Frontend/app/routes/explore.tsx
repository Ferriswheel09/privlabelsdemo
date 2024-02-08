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



import ExploreSidebar from "../ExploreSidebar";

import {
    Divider
} from "@nextui-org/react";

export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    return json({ q });
};


export default function Index() {
    const { q } = useLoaderData<typeof loader>();
    const navigation = useNavigation();

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has(
            "q"
        );

    const runs = [ //will be set by loader
        {
            key: "run_69",
            label: "Run 69",
        },
        {
            key: "run_68",
            label: "Run 68",
        },
        {
            key: "run_x",
            label: "...",
        },

    ];




    return (
        <div className="flex divide-x divide-doubles">
            <ExploreSidebar
                q={q}
                runs={runs}
                searching={searching}

            />

            <Divider orientation="vertical" />
            <div id="view-region" className="w-4/5 items-stretch h-screen overflow-y-aut">
                <h2 className="text-center underline">View</h2>

            </div>
        </div >
    );
}
