
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


import { PiGlobeStandFill } from "react-icons/pi";
import { PiGlobeStandLight } from "react-icons/pi";

export default function SiteIcon() {
    const [mounted, setMounted] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (<PiGlobeStandLight></PiGlobeStandLight>);

    return (
        <div>
            {theme === 'dark' ?
                <PiGlobeStandLight></PiGlobeStandLight>
                :
                <PiGlobeStandFill></PiGlobeStandFill>}
        </div>
    );
}  
