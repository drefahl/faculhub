"use client"

import {
  automationControlEngineeringCurriculum,
  automationControlEngineeringNewCurriculum,
} from "@/data/courses/automation-control-engineering"
import { computerEngineeringCurriculum, computerEngineeringNewCurriculum } from "@/data/courses/computer-engineering"
import { useState } from "react"
import { CourseSelector } from "./_components/course-selector"
import { CurriculumGrid } from "./_components/curriculum-grid"

export default function Home() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Grade Curricular Universitária</h1>
      <CurriculumGridContainer />
    </div>
  )
}

function CurriculumGridContainer() {
  const courses = [
    {
      id: "computer-engineering-new",
      name: "Engenharia de Computação (PPC NOVO)",
      data: computerEngineeringNewCurriculum,
    },
    {
      id: "computer-engineering-old",
      name: "Engenharia de Computação (PPC ANTIGO)",
      data: computerEngineeringCurriculum,
    },
    {
      id: "automation-control-engineering-new",
      name: "Engenharia de Controle e Automação (PPC NOVO)",
      data: automationControlEngineeringNewCurriculum,
    },
    {
      id: "automation-control-engineering-old",
      name: "Engenharia de Controle e Automação (PPC ANTIGO)",
      data: automationControlEngineeringCurriculum,
    },
  ]

  const [selectedCourse, setSelectedCourse] = useState(courses[0])

  return (
    <div className="space-y-6">
      <CourseSelector courses={courses} selectedCourse={selectedCourse} onSelectCourse={setSelectedCourse} />
      <CurriculumGrid curriculumData={selectedCourse.data} />
    </div>
  )
}
