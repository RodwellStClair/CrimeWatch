import ChartJS from 'chart.js/auto';

const chartAreaBackgroundPlugin = {
  id: 'chartAreaBackground',
  beforeDraw(chart, args, options) {
    const { ctx, chartArea: { left, top, width, height } } = chart;
    ctx.save();
    ctx.fillStyle = options.backgroundColor || 'white';
    ctx.strokeStyle = options.borderColor || 'black';
    ctx.lineWidth = options.borderWidth || 2;
    ctx.fillRect(left, top, width, height);
    ctx.strokeRect(left, top, width, height);
    ctx.restore();
  }
};
ChartJS.register(chartAreaBackgroundPlugin);

const chartconfig = {
  type: 'line',
  data: {
    labels: '',
    datasets: [{
      label: 'Total Crime Counts per month',
      fill: false,
      backgroundColor: 'blue',
      borderColor: 'blue',
      data: '',
    },]
  },
  options: {
    aspectRatio: 0,
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Crime Counts',
        color: 'white',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      chartAreaBackground: {
        backgroundColor: '#cbcfd3',
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 12,
            family: 'Arial',
          },
        },
        type: 'time',
        time: {
          unit: 'month',
        },
        display: true,
        title: {
          display: true,
          text: 'Month',
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: {
        ticks: {
          color: 'white',
          font: {
            size: 12,
            family: 'Arial',
          }
        },
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Total Crime Counts per month',
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  },
};

export default chartconfig;
