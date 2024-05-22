/* eslint-disable react/prop-types */
import { Line } from "react-chartjs-2";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import chartconfig from './barChartConfig';
import getColor from "../../utilities/getColor";

function LineChart( {crimeMonthlySummary}) {
  const datasets = {};

  crimeMonthlySummary.forEach(item => {
    item.crime_data.categories.forEach(category => {
      if (!datasets[category.category]) {
        datasets[category.category] = Array(crimeMonthlySummary.length).fill(0);
      }
      const monthIndex = crimeMonthlySummary.findIndex(data => data.month === item.month);
      datasets[category.category][monthIndex] = category.count;
    });
  });

  chartconfig.data.labels = crimeMonthlySummary.map((item) => item.month);
  chartconfig.data.datasets = Object.keys(datasets).map((category) => ({
    label: category,
    data: datasets[category],
    backgroundColor: getColor(category),
    borderColor: getColor(category),
    borderWidth: 2,
  }));




  return <Line data={chartconfig.data} options={chartconfig.options} />;
}

export default LineChart;
