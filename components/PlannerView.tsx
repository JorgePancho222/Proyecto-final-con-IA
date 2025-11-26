import React, { useState } from 'react';
import { Calendar, CheckCircle2, Loader2, Salad, Utensils } from 'lucide-react';
import { generateMealPlan } from '../services/geminiService';
import { MealPlanResponse } from '../types';

export const PlannerView: React.FC = () => {
  const [goal, setGoal] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<MealPlanResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    
    setLoading(true);
    setPlanData(null);
    try {
      const result = await generateMealPlan(goal, restrictions || 'Ninguna');
      setPlanData(result);
    } catch (err) {
      console.error(err);
      alert('Error al generar el plan. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
       <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Planificador Semanal</h2>
        <p className="text-gray-600">Define tus objetivos y crea un menú completo adaptado a tus necesidades.</p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Objetivo Principal</label>
            <input 
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ej: Perder peso, Ganar músculo, Comer más verduras..." 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Restricciones / Preferencias</label>
            <input 
              type="text" 
              value={restrictions}
              onChange={(e) => setRestrictions(e.target.value)}
              placeholder="Ej: Vegano, Sin gluten, Keto..." 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Calendar className="w-5 h-5 mr-2" />}
            {loading ? 'Generando Plan...' : 'Crear Plan Semanal'}
          </button>
        </div>
      </form>

      {planData && (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-start">
             <CheckCircle2 className="w-6 h-6 text-emerald-600 mr-4 flex-shrink-0 mt-1" />
             <div>
               <h3 className="text-lg font-bold text-emerald-800">Plan Generado con Éxito</h3>
               <p className="text-emerald-700 mt-1">{planData.weeklyGoal}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {planData.plan.map((day, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-gray-800 text-lg">{day.day}</h4>
                  <div className="bg-gray-100 p-1.5 rounded-lg">
                    <Utensils className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Desayuno</span>
                    <p className="text-gray-700">{day.breakfast}</p>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Almuerzo</span>
                    <p className="text-gray-700">{day.lunch}</p>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Cena</span>
                    <p className="text-gray-700">{day.dinner}</p>
                  </div>
                   <div className="pt-2 border-t border-dashed border-gray-200">
                    <div className="flex items-center text-xs text-gray-500">
                       <Salad className="w-3 h-3 mr-1" /> Snack: {day.snack}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};