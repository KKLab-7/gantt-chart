import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function LineChart({ auth, laravelVersion, phpVersion }) {
    /** グラフオプション */
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Line Chart',
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
        },
    };
    /** グラフデータ */
    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const graphData = {
        labels,
        datasets: [
            {
                data: [16, 42, 117.5, 90.5, 120.5, 225, 193, 110, 197, 529.5, 156.5, 76.5],
                backgroundColor: 'rgba(30, 144, 255, 0.2)',
                borderColor: 'rgba(30, 144, 255, 1)',
                label: '合計降水量(mm)',
                fill: 'origin',
            },
            {
                // データセットを追加
                data: [52.3, 56.1, 117.5, 124.5, 137.8, 167.7, 153.5, 168.2, 209.9, 197.8, 92.5, 51],
                backgroundColor: 'rgba(30, 144, 255, 0.2)',
                borderColor: 'rgba(30, 144, 255, 0.2)',
                label: '合計降水量例年値(mm)',
            },
        ],
    };

    const barData = {
        // x 軸のラベル
        labels: ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月', '7 月'],
        datasets: [
            {
                label: 'Dataset',
                // データの値
                data: [65, 59, 80, 81, 56, 55, 40],
                // グラフの背景色
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                ],
                // グラフの枠線の色
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                ],
                // グラフの枠線の太さ
                borderWidth: 1,
            },
        ],
    };

    return (
        <Line data={graphData} options={options} />
    );
}