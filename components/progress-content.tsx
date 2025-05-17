"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

import type { ExerciseData } from "@/lib/google-sheets"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressContentProps {
  exercises: ExerciseData[]
}

export function ProgressContent({ exercises }: ProgressContentProps) {
  // Prepare data for charts
  const strengthData = exercises.map((ex) => ({
    name: ex.name,
    current: ex.lastWeight,
    best: ex.personalBest,
    unit: ex.unit,
  }))

  // Calculate category distribution
  const categoryData = exercises.reduce(
    (acc, ex) => {
      if (!acc[ex.category]) {
        acc[ex.category] = 0
      }
      acc[ex.category]++
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }))

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Strength Comparison</CardTitle>
          <CardDescription>Current vs. Personal Best weights for each exercise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={strengthData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 70,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis
                  label={{
                    value: "Weight",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value, name, { payload }) => {
                    return [`${value} ${payload.unit}`, name === "current" ? "Current Weight" : "Personal Best"]
                  }}
                />
                <Legend />
                <Bar dataKey="current" name="Current Weight" fill="#8884d8" />
                <Bar dataKey="best" name="Personal Best" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Distribution</CardTitle>
          <CardDescription>Breakdown of exercises by muscle group</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} exercises`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
          <CardDescription>Key metrics about your strength training</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Total Exercises</h3>
              <p className="text-2xl font-bold">{exercises.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Muscle Groups</h3>
              <p className="text-2xl font-bold">{Object.keys(categoryData).length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">At Personal Best</h3>
              <p className="text-2xl font-bold">
                {exercises.filter((ex) => ex.lastWeight === ex.personalBest).length} exercises
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Average Completion</h3>
              <p className="text-2xl font-bold">
                {exercises.length > 0
                  ? `${Math.round((exercises.reduce((sum, ex) => sum + ex.lastWeight / ex.personalBest, 0) / exercises.length) * 100)}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
