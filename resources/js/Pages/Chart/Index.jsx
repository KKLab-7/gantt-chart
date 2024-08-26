import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import PieChart from './Partials/PieChart';
import LineChart from './Partials/LineChart';
import BarChart from './Partials/BarChart';
import Select from "react-select";
import { useState } from 'react';

export default function Index({ auth, programUuidList }) {
    const [pieChartData, setPieChartData] = useState({});
    const [barChartData, setBarChartData] = useState({});

    const updateTask = (programUuid) => {
        axios.post(
            route('api.chart.program.rate',
                {
                    programUuid: programUuid,
                }
            )
        ).then(response => {
            setPieChartData(response.data[0]);
            setBarChartData(response.data[1]);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chart</h2>}
        >
            <Head title="Chart" />

            {/* グラフコンポーネントの呼び出し */}
            <div className="component-main">
                <Select
                    className='w-1/4 ml-auto'
                    name={'progress_list'}
                    options={programUuidList}
                    onChange={(e) => updateTask(e.value)}
                />
                <div className='md:flex md:flex-wrap bg-white'>
                    <div className='chart-box'>
                        <div className='chart-border' style={{ height: "700px" }}>
                            <BarChart
                                data={barChartData}
                            />
                        </div>
                    </div>
                    <div className='chart-box'>
                        <div className='chart-border' style={{ height: "700px" }}>
                            <PieChart
                                data={pieChartData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}