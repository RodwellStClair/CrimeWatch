import { Line } from "react-chartjs-2";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import chartconfig from './barChartConfig';
import getColor from "../../utilities/getColor";

function LineChart(item) {
  chartconfig.data.datasets = [];

  function getCategories(item) {
    const datasets = {}
    item.crimeMonthlySummary?.forEach(item => {
      for (const items of item.crime_data.categories) {
        if (datasets[items.category]) {
          datasets[items.category].push(items.count)
        } else {
          datasets[items.category] = [items.count]
        }
      }
    })
    return datasets
  }

  chartconfig.data.labels = item.crimeMonthlySummary?.map(item => item.month);
  const categories = getCategories(item)

  for (const category in categories) {

    chartconfig.data.datasets.push({
      label: category,
      data: categories[category],
      backgroundColor: getColor(category),
      borderColor: getColor(category),
      borderWidth: 2,
    })
  }

  return <Line data={chartconfig.data}
    options={chartconfig.options}
  />;
}

export default LineChart;
