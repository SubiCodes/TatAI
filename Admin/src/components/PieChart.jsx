import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart() {

    const data = {
        labels: ['Cooking', 'DIY', 'Repair', 'Tools'],
        datasets: [
          {
            label: 'Total Guides',
            data: [12, 19, 3, 5],
            backgroundColor: [
              'rgba(50, 50, 120, 1)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 0,
          },
        ],
      };

  return (
    <Pie data={data} className='w-full '/>
  )
}

export default PieChart