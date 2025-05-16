'use client'

import {useEffect, useState} from "react";

type MachineSensors = {
    state: number; temp: number; vibration: number;
};

type Machine = {
    sensors: MachineSensors; state: string;
};

type MachinesData = {
    [machineId: string]: Machine;
};

export default function Home() {

    const [data, setData] = useState<MachinesData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5195/factory/state');
                if (!res.ok) throw new Error('Failed to fetch');
                const data: MachinesData = await res.json();
                setData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-end p-6 bg-neutral-100 min-h-screen">
            <div className="font-[family-name:var(--font-geist-sans)] flex flex-col w-1/2 ">
                {Object.entries(data).map(([machineId, machine]) => {
                    // Convert "machine0" => "Machine 0"
                    const displayId = machineId.replace("machine", "Machine ");
                    return (
                        <div key={machineId} style={{
                            border: '1px solid black',
                            borderRadius: '5px',
                            margin: '1em 0',
                            padding: '1em',
                            backgroundImage: 'url(/rust.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            minHeight: '250px',
                        }}>
                            <h2 className="bg-neutral-800 w-fit pt-1 pb-1 pr-2 pl-2 text-xl rounded-sm border-2 border-slate-400">{displayId}</h2>
                            <p>Status: {machine.state}</p>
                            <ul>
                                <li>Sensor state: {machine.sensors.state}</li>
                                <li>Temperature: {machine.sensors.temp}</li>
                                <li>Vibration: {machine.sensors.vibration}</li>
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
