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

export default function BarChart({ auth, laravelVersion, phpVersion }) {
    /** グラフデータ */
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
        <Bar data={barData} />
    );
}