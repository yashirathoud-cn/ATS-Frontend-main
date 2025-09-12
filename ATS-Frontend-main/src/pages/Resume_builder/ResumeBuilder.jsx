import React from 'react'
import Job_ready from './Job_ready'
import ResumeSteps from './ResumeSteps'
import TemplateCard from './TemplateCard'
function ResumeBuilder() {
  return (
    <div className='bg-black'>
      <Job_ready />
      <TemplateCard/>
      <ResumeSteps/>
    </div>
  )
}

export default ResumeBuilder
