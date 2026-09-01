import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FreshmanFoundationScreen from './year/FreshmanFoundationScreen';
import SophomoreDsaPrepScreen from './year/SophomoreDsaPrepScreen';
import JuniorMockTestScreen from './year/JuniorMockTestScreen';
import FinalYearDrivePipelineScreen from './year/FinalYearDrivePipelineScreen';
import { FaBook, FaCode, FaLaptopCode, FaRocket } from 'react-icons/fa';

export function StudentYearScreenPage() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(user?.academicYear || 4);

  return (
    <div className="space-y-6">
      <div className="p-6 neu-card space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <span className="neu-chip-active">PAGE 6 OF 10 • ACADEMIC YEAR ROADMAP</span>
            <h1 className="text-xl font-bold text-slate-800 mt-1">Year-Specific Skill & Career Progression Roadmap</h1>
            <p className="text-xs text-slate-600">Custom tailored path for Freshman, Sophomore, Junior, and Senior Placement Year</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setSelectedYear(1)} 
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${selectedYear === 1 ? 'neu-chip-active' : 'neu-chip-inactive'}`}
            >
              <FaBook /> 1st Year (Freshman)
            </button>
            <button 
              onClick={() => setSelectedYear(2)} 
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${selectedYear === 2 ? 'neu-chip-active' : 'neu-chip-inactive'}`}
            >
              <FaCode /> 2nd Year (Sophomore)
            </button>
            <button 
              onClick={() => setSelectedYear(3)} 
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${selectedYear === 3 ? 'neu-chip-active' : 'neu-chip-inactive'}`}
            >
              <FaLaptopCode /> 3rd Year (Junior)
            </button>
            <button 
              onClick={() => setSelectedYear(4)} 
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${selectedYear === 4 ? 'neu-chip-active' : 'neu-chip-inactive'}`}
            >
              <FaRocket /> 4th Year (Senior)
            </button>
          </div>
        </div>

        <div className="pt-2">
          {selectedYear === 1 && <FreshmanFoundationScreen />}
          {selectedYear === 2 && <SophomoreDsaPrepScreen />}
          {selectedYear === 3 && <JuniorMockTestScreen />}
          {selectedYear === 4 && <FinalYearDrivePipelineScreen />}
        </div>
      </div>
    </div>
  );
}

export default StudentYearScreenPage;
