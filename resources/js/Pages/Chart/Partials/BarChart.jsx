import {
    Chart as ChartJS,
    CategoryScale,
    BarElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    BarElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function BarChart({ data = [] }) {
    /** グラフデータ */
    const barData = {
        // x 軸のラベル
        labels: data['month_and_year_list'],
        datasets: [
            {
                label: 'Not Started',
                data: data['not_started_list'],  // 各月の未着データ
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // 色
            },
            {
                label: 'In Progress',
                data: data['in_progress_list'],   // 各月の着手中データ
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // 色
            },
            {
                label: 'Completed',
                data: data['full_progress_list'],   // 各月の完了データ
                backgroundColor: 'rgba(75, 192, 192, 0.5)', // 色
            }
        ],
    };

    const NoDataPlugin = {
        id: 'noDataPlugin',
        beforeDraw(chart) {
            const { ctx, chartArea, data } = chart;

            if (!data.datasets.length || data.datasets.every(dataset => dataset.data.every(value => value === 0))) {
                const { width, height } = chartArea;
                const x = width / 2;
                const y = height / 2;

                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '16px Arial';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillText('Choose Program', x, y);
                ctx.restore();
            }
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '月別の未着手、着手中、完了のデータ',
            },
        },
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                beginAtZero: true,
            },
        },
        plugins: {
            noDataPlugin: NoDataPlugin
        }
    };

    return (
        <Bar data={barData} options={options} plugins={[NoDataPlugin]} />
    );
}