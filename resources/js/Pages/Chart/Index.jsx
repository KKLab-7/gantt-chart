import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, Head } from '@inertiajs/react';
import PieChart from './Partials/PieChart';
import LineChart from './Partials/LineChart';
import BarChart from './Partials/BarChart';

export default function Index({ auth, laravelVersion, phpVersion }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chart</h2>}
        >
            <Head title="Chart" />

            {/* グラフコンポーネントの呼び出し */}
            <div className="component-main">
                <div className='md:flex md:flex-wrap bg-white'>
                    <div className='chart-box'>
                        <div className='chart-border'>
                            <LineChart/>
                        </div>
                    </div>
                    <div className='chart-box'>
                        <div className='chart-border'>
                            <BarChart />
                        </div>
                    </div>
                    <div className='chart-box'>
                        <div className='chart-border'>
                            <PieChart />
                        </div>
                    </div>
                    <div className='chart-box'>
                        <div className='chart-border'>
                            <LineChart />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}