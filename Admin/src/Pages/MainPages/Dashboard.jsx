import BarChart from "../../components/BarChart.jsx"

function Dashboard() {
  
  return (
    <>
      <div className="flex-1">
        <div className="w-full h-auto items-center justify-center flex flex-col pt-16"> 
          <BarChart/>
        </div>
        
      </div>
    </>
  )
}

export default Dashboard