import { Link, Head } from '@inertiajs/react';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
    BarElement,
    ArcElement,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

export default function PieChart({data = []}) {

    /** グラフデータ */
    let labels = [];
    let datasetsValue = [];
    const capitalize = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    };
    if (Object.keys(data).length > 0) {
        Object.keys(data).map((e) => {
            if (e.includes('_')) {
                labels.push(e.split('_')
                    .map(word =>
                        capitalize(word)
                    )
                    .join(' '));
            } else {
                labels.push(capitalize(e));
            }

            datasetsValue.push(data[e]);
        });
    }

    const noDataPlugin = {
        id: 'noDataPlugin',
        beforeDraw: (chart) => {
            if (chart.data.datasets[0].data.length === 0) {
                const ctx = chart.ctx;
                const width = chart.width;
                const height = chart.height;
                ctx.save();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '16px Arial';
                ctx.fillStyle = '#666';
                ctx.fillText('Choose Program', width / 2, height / 2);

                // draw outline
                ctx.strokeStyle = 'rgba(255,112,162,0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, (width - 100) / 2, 0, 3 * Math.PI);
                ctx.stroke();

                ctx.restore();
            }
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            },
            emptyDoughnut: {
                color: 'rgba(255,112,162,0.8)',
                width: 2,
                radiusDecrease: 20
            },
            tooltip: {
                titleFont: { size: 17 },
                bodyFont: { size: 17 },
                titleMarginBottom: 15,
                backgroundColor: "rgba(255,112,162,0.8)",
                titleColor: "rgba(0,0,0,1)",
                bodyColor: "rgba(0,0,0,1)",
                displayColors: true,
                xAlign: "center"
            },
            noDataPlugin: {}
        },
    };

    const pieData = {
        // x 軸のラベル
        labels: labels,
        datasets: [
            {
                label: 'Rate',
                // データの値
                data: datasetsValue,
                // グラフの背景色
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                // グラフの枠線の色
                borderColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                // グラフの枠線の太さ
                borderWidth: 1,
            },
        ],
    };

    return (
        <Pie data={pieData} options={options} plugins={[noDataPlugin]}/>
    );
}