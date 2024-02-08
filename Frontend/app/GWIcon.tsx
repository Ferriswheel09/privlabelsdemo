import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import logoBlack from "./resources/gw_blk.png"
import logoWhite from "./resources/gw_wht.png"

export default function GWIcon(){
    const [mounted, setMounted] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        setMounted(true)
    } , [] )

    if(!mounted) return (<img src={logoBlack} className="max-h-8 mr-2"/>)

    return(
        <div>
            {theme === 'dark' ?
                <img src={logoWhite} className="max-h-8 mr-2"/>
                :
                <img src={logoBlack} className="max-h-8 mr-2"/>}
        </div>
    );


}