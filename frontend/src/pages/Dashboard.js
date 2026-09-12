import React from 'react';
import { BookOpen, Users, GraduationCap, HelpCircle, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/dashboard.css';

const stats = [
  { label: 'Total Courses', value: '0', change: '0 this month', icon: BookOpen, accent: 'pink' },
  { label: 'Total Students', value: '0', change: '0 this month', icon: Users, accent: 'gold' },
  { label: 'Total Teachers', value: '0', change: '0 this month', icon: GraduationCap, accent: 'plum' },
  { label: 'Pending Questions', value: '0', change: '0 unresolved', icon: HelpCircle, accent: 'coral' },
];

const recentCourses = [
  { name: 'Two-Wheeler Basics', teacher: 'R. Kumar', students: 142, status: 'Active' },
  { name: 'Heavy Vehicle License Prep', teacher: 'S. Iyer', students: 88, status: 'Active' },
  { name: 'Road Safety & Signs', teacher: 'A. Nair', students: 210, status: 'Draft' },
  { name: 'Defensive Driving', teacher: 'M. Raj', students: 64, status: 'Active' },
];

export default function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <DashboardLayout
      title={`Welcome back, ${storedUser.name || 'Admin'}`}
      subtitle="Here's what's happening across your courses today."
    >
      <div className="stat-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card accent-${stat.accent}`}>
            <div className="stat-card-icon">
              <stat.icon size={20} />
            </div>
            <p className="stat-card-value">{stat.value}</p>
            <p className="stat-card-label">{stat.label}</p>
            <p className="stat-card-change">{stat.change}</p>
          </div>
        ))}
      </div>

     
    </DashboardLayout>
  );
}